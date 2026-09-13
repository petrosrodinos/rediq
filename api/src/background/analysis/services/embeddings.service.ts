import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AiService } from '@/integrations/ai/services/ai.service';
import { chunkArray } from '../utils/ranking.utils';

const EMBEDDING_MODEL = 'text-embedding-3-small';
// One embedMany call covers a whole batch instead of one OpenAI request per
// item, so this is now a request-count cap, not a concurrency limit. Keeping
// batches bounded means a single slow/failed request only costs this many
// items instead of the whole job, while still cutting request count ~100x
// versus the old one-call-per-item approach.
const BATCH_SIZE = 100;

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
    const validTargets = targets.filter((target) => target.content?.trim());
    if (!validTargets.length) return;

    // A crashed/restarted job re-runs this same call with the full target
    // list, so anything embedded before the crash must be skipped rather than
    // re-inserted — otherwise the unique constraint on e.g. post_uuid throws
    // and the whole batch (including the genuinely-pending items in it) fails.
    const alreadyEmbedded = await this.getAlreadyEmbeddedKeys(validTargets);
    const pendingTargets = validTargets.filter(
      (target) => !alreadyEmbedded.has(`${target.kind}:${target.id}`),
    );

    const batches = chunkArray(pendingTargets, BATCH_SIZE);

    for (const batch of batches) {
      let vectors: number[][];
      try {
        vectors = await this.aiService.embedTexts(
          batch.map((target) => target.content.slice(0, 8000)),
        );
      } catch (error) {
        this.logger.warn(
          `Failed to embed batch of ${batch.length} items: ${error.message}`,
        );
        continue;
      }

      await this.prisma.embedding.createMany({
        data: batch.map((target, index) => ({
          research_project_uuid: researchProjectId,
          model: EMBEDDING_MODEL,
          dimensions: vectors[index].length,
          vector: vectors[index],
          ...(target.kind === 'post' && { post_uuid: target.id }),
          ...(target.kind === 'comment' && { comment_uuid: target.id }),
          ...(target.kind === 'knowledge_chunk' && {
            knowledge_chunk_uuid: target.id,
          }),
          ...(target.kind === 'knowledge_insight' && {
            knowledge_insight_uuid: target.id,
          }),
        })),
        // Belt-and-braces against a concurrent re-run racing this one; the
        // upfront filter above is what actually skips the bulk of the work.
        skipDuplicates: true,
      });
    }
  }

  private async getAlreadyEmbeddedKeys(
    targets: EmbeddingTarget[],
  ): Promise<Set<string>> {
    const idsByKind: Record<EmbeddingTarget['kind'], string[]> = {
      post: [],
      comment: [],
      knowledge_chunk: [],
      knowledge_insight: [],
    };
    for (const target of targets) idsByKind[target.kind].push(target.id);

    const existing = await this.prisma.embedding.findMany({
      where: {
        OR: [
          { post_uuid: { in: idsByKind.post } },
          { comment_uuid: { in: idsByKind.comment } },
          { knowledge_chunk_uuid: { in: idsByKind.knowledge_chunk } },
          { knowledge_insight_uuid: { in: idsByKind.knowledge_insight } },
        ],
      },
      select: {
        post_uuid: true,
        comment_uuid: true,
        knowledge_chunk_uuid: true,
        knowledge_insight_uuid: true,
      },
    });

    const keys = new Set<string>();
    for (const embedding of existing) {
      if (embedding.post_uuid) keys.add(`post:${embedding.post_uuid}`);
      if (embedding.comment_uuid) keys.add(`comment:${embedding.comment_uuid}`);
      if (embedding.knowledge_chunk_uuid) {
        keys.add(`knowledge_chunk:${embedding.knowledge_chunk_uuid}`);
      }
      if (embedding.knowledge_insight_uuid) {
        keys.add(`knowledge_insight:${embedding.knowledge_insight_uuid}`);
      }
    }
    return keys;
  }
}
