import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { KnowledgeChunkQueryType } from './dto/knowledge-chunk-query.schema';

@Injectable()
export class KnowledgeChunksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    researchProjectId: string,
    query: KnowledgeChunkQueryType,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: researchProjectId, user_uuid: userId },
    });

    if (!project) throw new NotFoundException('Research project not found');

    const where = { research_project_uuid: researchProjectId };

    const [items, count] = await Promise.all([
      this.prisma.knowledgeChunk.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { chunk_index: 'asc' },
      }),
      this.prisma.knowledgeChunk.count({ where }),
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
}
