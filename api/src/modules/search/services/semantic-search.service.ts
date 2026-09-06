import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AiService } from '@/integrations/ai/services/ai.service';
import { cosineSimilarity } from '../utils/cosine-similarity.utils';

export type SemanticResultType =
  | 'post'
  | 'comment'
  | 'knowledge_chunk'
  | 'knowledge_insight';

export interface SemanticSearchResult {
  type: SemanticResultType;
  id: string;
  score: number;
  excerpt: string;
  source: any;
}

const TYPE_TO_FK: Record<SemanticResultType, string> = {
  post: 'post_uuid',
  comment: 'comment_uuid',
  knowledge_chunk: 'knowledge_chunk_uuid',
  knowledge_insight: 'knowledge_insight_uuid',
};

@Injectable()
export class SemanticSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async findSimilar(
    researchProjectUuid: string,
    queryText: string,
    options?: { limit?: number; types?: SemanticResultType[] },
  ): Promise<SemanticSearchResult[]> {
    const types = options?.types?.length
      ? options.types
      : (Object.keys(TYPE_TO_FK) as SemanticResultType[]);
    const limit = options?.limit ?? 10;

    const queryVector = await this.aiService.embedText(queryText);

    const embeddings = await this.prisma.embedding.findMany({
      where: {
        research_project_uuid: researchProjectUuid,
        OR: types.map((type) => ({ [TYPE_TO_FK[type]]: { not: null } })),
      },
    });

    if (embeddings.length === 0) return [];

    const scored = embeddings
      .map((embedding) => {
        const type = types.find((t) => embedding[TYPE_TO_FK[t]]);
        if (!type) return null;

        return {
          type,
          id: embedding[TYPE_TO_FK[type]] as string,
          score: cosineSimilarity(queryVector, embedding.vector),
        };
      })
      .filter(
        (
          entry,
        ): entry is { type: SemanticResultType; id: string; score: number } =>
          entry !== null,
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return this.hydrateResults(scored);
  }

  private async hydrateResults(
    scored: { type: SemanticResultType; id: string; score: number }[],
  ): Promise<SemanticSearchResult[]> {
    const idsByType: Record<SemanticResultType, string[]> = {
      post: [],
      comment: [],
      knowledge_chunk: [],
      knowledge_insight: [],
    };

    for (const entry of scored) {
      idsByType[entry.type].push(entry.id);
    }

    const [posts, comments, chunks, insights] = await Promise.all([
      idsByType.post.length
        ? this.prisma.post.findMany({ where: { id: { in: idsByType.post } } })
        : Promise.resolve([]),
      idsByType.comment.length
        ? this.prisma.comment.findMany({
            where: { id: { in: idsByType.comment } },
          })
        : Promise.resolve([]),
      idsByType.knowledge_chunk.length
        ? this.prisma.knowledgeChunk.findMany({
            where: { id: { in: idsByType.knowledge_chunk } },
          })
        : Promise.resolve([]),
      idsByType.knowledge_insight.length
        ? this.prisma.knowledgeInsight.findMany({
            where: { id: { in: idsByType.knowledge_insight } },
          })
        : Promise.resolve([]),
    ]);

    const postsById = new Map(posts.map((p) => [p.id, p]));
    const commentsById = new Map(comments.map((c) => [c.id, c]));
    const chunksById = new Map(chunks.map((c) => [c.id, c]));
    const insightsById = new Map(insights.map((i) => [i.id, i]));

    const results: SemanticSearchResult[] = [];

    for (const entry of scored) {
      let source: any;
      let excerpt = '';

      if (entry.type === 'post') {
        source = postsById.get(entry.id);
        if (!source) continue;
        excerpt = `${source.title ?? ''} ${source.body ?? ''}`
          .trim()
          .slice(0, 200);
      } else if (entry.type === 'comment') {
        source = commentsById.get(entry.id);
        if (!source) continue;
        excerpt = (source.body ?? '').slice(0, 200);
      } else if (entry.type === 'knowledge_chunk') {
        source = chunksById.get(entry.id);
        if (!source) continue;
        excerpt = (source.content ?? '').slice(0, 200);
      } else {
        source = insightsById.get(entry.id);
        if (!source) continue;
        excerpt = (source.content ?? '').slice(0, 200);
      }

      results.push({
        type: entry.type,
        id: entry.id,
        score: entry.score,
        excerpt,
        source,
      });
    }

    return results;
  }
}
