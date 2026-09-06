import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ANALYSIS_QUEUE_NAME,
  AnalysisQueueJobData,
} from '@/core/queues/queues.constants';
import {
  AnalysisStatus,
  BatchSubmissionStatus,
  ProcessingMode,
} from 'generated/prisma';
import { RedditIngestionService } from './services/reddit-ingestion.service';
import { EmbeddingsService } from './services/embeddings.service';
import { KnowledgeExtractionService } from './services/knowledge-extraction.service';
import { deduplicateByContent, rankByValue } from './utils/ranking.utils';
import { ChunkForExtraction } from './interfaces/extraction.interfaces';

const MAX_CHUNKS_FOR_EXTRACTION = 400;

@Processor(ANALYSIS_QUEUE_NAME)
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redditIngestionService: RedditIngestionService,
    private readonly embeddingsService: EmbeddingsService,
    private readonly knowledgeExtractionService: KnowledgeExtractionService,
  ) {
    super();
  }

  async process(job: Job<AnalysisQueueJobData>): Promise<void> {
    const { analysisJobUuid } = job.data;

    const analysisJob = await this.prisma.analysisJob.findUnique({
      where: { id: analysisJobUuid },
      include: {
        configuration: true,
        research_project: { include: { source: true } },
      },
    });

    if (!analysisJob) {
      this.logger.warn(`Analysis job ${analysisJobUuid} not found, skipping`);
      return;
    }

    const researchProjectId = analysisJob.research_project_uuid;
    const source = analysisJob.research_project.source;
    const configuration = analysisJob.configuration;

    if (!source) {
      await this.fail(
        analysisJobUuid,
        researchProjectId,
        'Research project has no source configured',
      );
      return;
    }

    try {
      await this.updateStatus(
        analysisJobUuid,
        researchProjectId,
        AnalysisStatus.COLLECTING_DATA,
        {
          started_at: new Date(),
          current_step: 'Collecting Reddit content',
        },
      );

      const { postIds, commentIds } = await this.redditIngestionService.ingest(
        researchProjectId,
        source,
        configuration,
        async (
          postsProcessed,
          postsTotal,
          commentsProcessed,
          commentsTotal,
        ) => {
          await this.prisma.analysisJob.update({
            where: { id: analysisJobUuid },
            data: {
              posts_processed: postsProcessed,
              posts_total: postsTotal,
              comments_processed: commentsProcessed,
              comments_total: commentsTotal,
            },
          });
        },
      );

      await this.updateStatus(analysisJobUuid, researchProjectId, AnalysisStatus.FILTERING, {
        current_step: 'Filtering content',
      });

      const posts = await this.prisma.post.findMany({
        where: { id: { in: postIds } },
      });
      const comments = await this.prisma.comment.findMany({
        where: { id: { in: commentIds } },
      });

      const keepDeleted = configuration.analyze_deleted_when_unavailable;
      const filteredPosts = posts.filter(
        (p) => keepDeleted || (!p.is_deleted && !p.is_removed),
      );
      const filteredComments = comments.filter(
        (c) => keepDeleted || (!c.is_deleted && !c.is_removed),
      );

      await this.updateStatus(
        analysisJobUuid,
        researchProjectId,
        AnalysisStatus.PROCESSING,
        {
          current_step: 'Deduplicating and ranking content',
        },
      );

      const dedupedPosts = deduplicateByContent(
        filteredPosts,
        (p) => p.body || p.title,
      );
      const dedupedComments = deduplicateByContent(
        filteredComments,
        (c) => c.body,
      );

      const weights = {
        prioritize_recent: configuration.prioritize_recent,
        prioritize_engagement: configuration.prioritize_engagement,
        prioritize_popular: configuration.prioritize_popular,
      };

      const rankedPosts = rankByValue(dedupedPosts, weights);
      const rankedComments = rankByValue(
        configuration.prioritize_top_comments
          ? [...dedupedComments].sort((a, b) => b.score - a.score)
          : dedupedComments,
        weights,
      );

      const chunks: ChunkForExtraction[] = [];
      let chunkIndex = 0;

      for (const post of rankedPosts) {
        const content = [post.title, post.body].filter(Boolean).join('\n\n');
        if (!content.trim()) continue;

        const chunk = await this.prisma.knowledgeChunk.create({
          data: {
            research_project_uuid: researchProjectId,
            analysis_job_uuid: analysisJobUuid,
            post_uuid: post.id,
            content,
            token_count: Math.ceil(content.length / 4),
            chunk_index: chunkIndex++,
          },
        });

        chunks.push({
          knowledgeChunkId: chunk.id,
          content,
          postUuid: post.id,
          commentUuid: null,
        });
      }

      for (const comment of rankedComments) {
        if (!comment.body?.trim()) continue;

        const chunk = await this.prisma.knowledgeChunk.create({
          data: {
            research_project_uuid: researchProjectId,
            analysis_job_uuid: analysisJobUuid,
            post_uuid: comment.post_uuid,
            comment_uuid: comment.id,
            content: comment.body,
            token_count: Math.ceil(comment.body.length / 4),
            chunk_index: chunkIndex++,
          },
        });

        chunks.push({
          knowledgeChunkId: chunk.id,
          content: comment.body,
          postUuid: comment.post_uuid,
          commentUuid: comment.id,
        });
      }

      const chunksForExtraction = chunks.slice(0, MAX_CHUNKS_FOR_EXTRACTION);

      await this.updateStatus(
        analysisJobUuid,
        researchProjectId,
        AnalysisStatus.GENERATING_EMBEDDINGS,
        {
          current_step: 'Generating embeddings',
        },
      );

      await this.embeddingsService.embedAndStore(researchProjectId, [
        ...rankedPosts
          .filter((p) => p.title || p.body)
          .map((p) => ({
            kind: 'post' as const,
            id: p.id,
            content: [p.title, p.body].filter(Boolean).join('\n\n'),
          })),
        ...rankedComments
          .filter((c) => c.body)
          .map((c) => ({
            kind: 'comment' as const,
            id: c.id,
            content: c.body as string,
          })),
      ]);

      if (configuration.processing_mode === ProcessingMode.BATCH) {
        await this.runBatchExtraction(
          analysisJobUuid,
          researchProjectId,
          chunksForExtraction,
        );
      } else {
        await this.updateStatus(
          analysisJobUuid,
          researchProjectId,
          AnalysisStatus.EXTRACTING_KNOWLEDGE,
          {
            current_step: 'Extracting knowledge',
          },
        );
        await this.knowledgeExtractionService.extractInsights(
          researchProjectId,
          analysisJobUuid,
          chunksForExtraction,
          configuration.processing_mode,
        );
      }

      await this.knowledgeExtractionService.clusterTopics(
        researchProjectId,
        analysisJobUuid,
        configuration.processing_mode,
      );

      await this.embeddingsService.embedAndStore(
        researchProjectId,
        (
          await this.prisma.knowledgeInsight.findMany({
            where: {
              research_project_uuid: researchProjectId,
              analysis_job_uuid: analysisJobUuid,
            },
            select: { id: true, title: true, content: true },
          })
        ).map((insight) => ({
          kind: 'knowledge_insight' as const,
          id: insight.id,
          content: `${insight.title}\n${insight.content}`,
        })),
      );

      await this.updateStatus(
        analysisJobUuid,
        researchProjectId,
        AnalysisStatus.SYNTHESIZING,
        {
          current_step: 'Generating final report',
        },
      );

      await this.knowledgeExtractionService.synthesizeExecutiveSummary(
        researchProjectId,
        analysisJobUuid,
        configuration.processing_mode,
      );

      await this.prisma.analysisJob.update({
        where: { id: analysisJobUuid },
        data: {
          status: AnalysisStatus.COMPLETED,
          current_step: null,
          completed_at: new Date(),
        },
      });

      await this.prisma.researchProject.update({
        where: { id: researchProjectId },
        data: {
          status: AnalysisStatus.COMPLETED,
          posts_analyzed: rankedPosts.length,
          comments_analyzed: rankedComments.length,
        },
      });
    } catch (error) {
      this.logger.error(
        `Analysis job ${analysisJobUuid} failed: ${error.message}`,
        error.stack,
      );
      await this.fail(analysisJobUuid, researchProjectId, error.message);
    }
  }

  private async runBatchExtraction(
    analysisJobUuid: string,
    researchProjectId: string,
    chunks: ChunkForExtraction[],
  ): Promise<void> {
    // NOTE: true OpenAI Batch API submission/polling is not implemented in this MVP.
    // We record a BatchSubmission row so the schema/architecture supports it, then run
    // the same synchronous extraction as Standard mode as a functional fallback, per the
    // resiliency guidance in the spec (fall back to standard for unresolved batch items).
    const batchSubmission = await this.prisma.batchSubmission.create({
      data: {
        analysis_job_uuid: analysisJobUuid,
        openai_batch_id: `local-${randomUUID()}`,
        status: BatchSubmissionStatus.IN_PROGRESS,
        submitted_at: new Date(),
      },
    });

    await this.updateStatus(
      analysisJobUuid,
      researchProjectId,
      AnalysisStatus.AWAITING_BATCH_COMPLETION,
      {
        current_step: 'Awaiting batch completion',
      },
    );

    try {
      await this.knowledgeExtractionService.extractInsights(
        researchProjectId,
        analysisJobUuid,
        chunks,
        ProcessingMode.BATCH,
      );

      await this.prisma.batchSubmission.update({
        where: { id: batchSubmission.id },
        data: { status: BatchSubmissionStatus.COMPLETED, completed_at: new Date() },
      });
    } catch (error) {
      await this.prisma.batchSubmission.update({
        where: { id: batchSubmission.id },
        data: { status: BatchSubmissionStatus.FAILED, completed_at: new Date() },
      });
      throw error;
    }
  }

  private async updateStatus(
    analysisJobId: string,
    researchProjectId: string,
    status: AnalysisStatus,
    extra: Record<string, unknown> = {},
  ): Promise<void> {
    await Promise.all([
      this.prisma.analysisJob.update({
        where: { id: analysisJobId },
        data: { status, ...extra },
      }),
      this.prisma.researchProject.update({
        where: { id: researchProjectId },
        data: { status },
      }),
    ]);
  }

  private async fail(
    analysisJobId: string,
    researchProjectId: string,
    message: string,
  ): Promise<void> {
    await Promise.all([
      this.prisma.analysisJob.update({
        where: { id: analysisJobId },
        data: {
          status: AnalysisStatus.FAILED,
          error_message: message,
          completed_at: new Date(),
        },
      }),
      this.prisma.researchProject.update({
        where: { id: researchProjectId },
        data: { status: AnalysisStatus.FAILED },
      }),
    ]);
  }
}
