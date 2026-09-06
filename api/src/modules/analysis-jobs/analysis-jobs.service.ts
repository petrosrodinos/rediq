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
        status: 'PENDING',
      },
      include: ANALYSIS_JOB_INCLUDE,
    });

    await this.prisma.researchProject.update({
      where: { id: researchProjectId },
      data: { status: 'PENDING' },
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
      ...(query.status && { status: query.status as any }),
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

    if (job.status === 'COMPLETED' || job.status === 'FAILED') {
      throw new ConflictException(
        `Cannot cancel a job that is already ${job.status.toLowerCase()}`,
      );
    }

    return this.prisma.analysisJob.update({
      where: { id: job.id },
      data: {
        status: 'FAILED',
        error_message: 'Cancelled by user',
        completed_at: new Date(),
      },
      include: ANALYSIS_JOB_INCLUDE,
    });
  }
}
