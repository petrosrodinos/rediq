import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AiService } from '@/integrations/ai/services/ai.service';
import { chunkArray } from '../utils/ranking.utils';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const CONCURRENCY = 5;

type EmbeddingTarget =
  | { kind: 'post'; id: string; content: string }
  | { kind: 'comment'; id: string; content: string }
  | { kind: 'knowledge_chunk'; id: string; content: string }
  | { kind: 'knowledge_insight'; id: string; content: string };

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async embedAndStore(
    researchProjectId: string,
    targets: EmbeddingTarget[],
  ): Promise<void> {
    const batches = chunkArray(targets, CONCURRENCY);

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (target) => {
          if (!target.content || !target.content.trim()) return;

          try {
            const vector = await this.aiService.embedText(
              target.content.slice(0, 8000),
            );

            await this.prisma.embedding.create({
              data: {
                research_project_uuid: researchProjectId,
                model: EMBEDDING_MODEL,
                dimensions: vector.length,
                vector,
                ...(target.kind === 'post' && { post_uuid: target.id }),
                ...(target.kind === 'comment' && { comment_uuid: target.id }),
                ...(target.kind === 'knowledge_chunk' && {
                  knowledge_chunk_uuid: target.id,
                }),
                ...(target.kind === 'knowledge_insight' && {
                  knowledge_insight_uuid: target.id,
                }),
              },
            });
          } catch (error) {
            this.logger.warn(
              `Failed to embed ${target.kind} ${target.id}: ${error.message}`,
            );
          }
        }),
      );
    }
  }
}
