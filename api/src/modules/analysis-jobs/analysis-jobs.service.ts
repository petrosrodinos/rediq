import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ANALYSIS_JOB_NAME,
  ANALYSIS_QUEUE_NAME,
  AnalysisQueueJobData,
} from '@/core/queues/queues.constants';
import { AnalysisStatus } from 'generated/prisma';
import { CreateAnalysisJobDto } from './dto/create-analysis-job.dto';
import { AnalysisJobsQueryType } from './dto/analysis-jobs-query.schema';

const ANALYSIS_JOB_INCLUDE = {
  configuration: true,
  batch_submissions: true,
};

@Injectable()
export class AnalysisJobsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(ANALYSIS_QUEUE_NAME)
    private readonly analysisQueue: Queue<AnalysisQueueJobData>,
  ) {}

  private async ensureProjectOwnership(
    userId: string,
    researchProjectId: string,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: researchProjectId, user_uuid: userId },
    });
    if (!project) throw new NotFoundException('Research project not found');
    return project;
  }

  async create(
    userId: string,
    researchProjectId: string,
    dto: CreateAnalysisJobDto,
  ) {
    await this.ensureProjectOwnership(userId, researchProjectId);

    const configuration = await this.prisma.analysisConfiguration.findFirst({
      where: {
        id: dto.analysis_configuration_uuid,
        research_project_uuid: researchProjectId,
      },
    });
    if (!configuration)
      throw new NotFoundException('Analysis configuration not found');

    const existingJob = await this.prisma.analysisJob.findUnique({
      where: { analysis_configuration_uuid: configuration.id },
    });
    if (existingJob) {
      throw new ConflictException(
        'This configuration already has an analysis job',
      );
    }

    const job = await this.prisma.analysisJob.create({
      data: {
        research_project_uuid: researchProjectId,
        analysis_configuration_uuid: configuration.id,
        status: AnalysisStatus.PENDING,
      },
      include: ANALYSIS_JOB_INCLUDE,
    });

    await this.prisma.researchProject.update({
      where: { id: researchProjectId },
      data: { status: AnalysisStatus.PENDING },
    });

    await this.analysisQueue.add(ANALYSIS_JOB_NAME, {
      analysisJobUuid: job.id,
    });

    return job;
  }

  async findAll(
    userId: string,
    researchProjectId: string,
    query: AnalysisJobsQueryType,
  ) {
    await this.ensureProjectOwnership(userId, researchProjectId);

    const where = {
      research_project_uuid: researchProjectId,
      ...(query.status && { status: query.status }),
    };

    const [items, count] = await Promise.all([
      this.prisma.analysisJob.findMany({
        where,
        include: ANALYSIS_JOB_INCLUDE,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
      }),
      this.prisma.analysisJob.count({ where }),
    ]);

    return {
      data: items,
      pagination: {
        total: count,
        page: query.page,
        limit: query.limit,
        total_pages: Math.ceil(count / query.limit),
        has_next: query.page < Math.ceil(count / query.limit),
        has_prev: query.page > 1,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const job = await this.prisma.analysisJob.findFirst({
      where: { id, research_project: { user_uuid: userId } },
      include: ANALYSIS_JOB_INCLUDE,
    });
    if (!job) throw new NotFoundException('Analysis job not found');
    return job;
  }

  async cancel(userId: string, id: string) {
    const job = await this.findOne(userId, id);

    if (
      job.status === AnalysisStatus.COMPLETED ||
      job.status === AnalysisStatus.FAILED
    ) {
      throw new ConflictException(
        `Cannot cancel a job that is already ${job.status.toLowerCase()}`,
      );
    }

    return this.prisma.analysisJob.update({
      where: { id: job.id },
      data: {
        status: AnalysisStatus.FAILED,
        error_message: 'Cancelled by user',
        completed_at: new Date(),
      },
      include: ANALYSIS_JOB_INCLUDE,
    });
  }

  async retry(userId: string, id: string) {
    const job = await this.findOne(userId, id);

    if (job.status !== AnalysisStatus.FAILED) {
      throw new ConflictException(
        `Cannot retry a job that is ${job.status.toLowerCase()}`,
      );
    }

    // The processor re-runs the pipeline for this same job id from the top
    // (re-collecting posts/comments is harmless — ingestion upserts by Reddit
    // id), but knowledge_chunks/knowledge_insights/batch_submissions from the
    // failed attempt have no dedup and would otherwise pile up as duplicates
    // alongside the retry's output, so clear them before re-queuing. Post/
    // comment embeddings are deliberately left alone — embedAndStore skips
    // ones that already exist, which is what lets retry resume past a partial
    // embedding run instead of redoing (and re-paying for) finished work.
    await this.prisma.$transaction([
      this.prisma.knowledgeChunk.deleteMany({
        where: { analysis_job_uuid: job.id },
      }),
      this.prisma.knowledgeInsight.deleteMany({
        where: { analysis_job_uuid: job.id },
      }),
      this.prisma.batchSubmission.deleteMany({
        where: { analysis_job_uuid: job.id },
      }),
      this.prisma.analysisJob.update({
        where: { id: job.id },
        data: {
          status: AnalysisStatus.PENDING,
          error_message: null,
          started_at: null,
          completed_at: null,
          current_step: null,
          posts_processed: 0,
          posts_total: 0,
          comments_processed: 0,
          comments_total: 0,
          prompt_tokens: 0,
          completion_tokens: 0,
        },
      }),
      this.prisma.researchProject.update({
        where: { id: job.research_project_uuid },
        data: { status: AnalysisStatus.PENDING },
      }),
    ]);

    await this.analysisQueue.add(ANALYSIS_JOB_NAME, {
      analysisJobUuid: job.id,
    });

    return this.findOne(userId, job.id);
  }
}
