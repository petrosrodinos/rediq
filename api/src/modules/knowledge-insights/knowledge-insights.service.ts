import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { KnowledgeInsightQueryType } from './dto/knowledge-insight-query.schema';

@Injectable()
export class KnowledgeInsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    researchProjectId: string,
    query: KnowledgeInsightQueryType,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: researchProjectId, user_uuid: userId },
    });

    if (!project) throw new NotFoundException('Research project not found');

    const where = {
      research_project_uuid: researchProjectId,
      ...(query.type && { type: query.type }),
      ...(query.topic_uuid && { topic_uuid: query.topic_uuid }),
      ...(query.min_confidence !== undefined && {
        confidence_score: { gte: query.min_confidence },
      }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { content: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, count] = await Promise.all([
      this.prisma.knowledgeInsight.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
        include: { citations: true, topic: true },
      }),
      this.prisma.knowledgeInsight.count({ where }),
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
    const insight = await this.prisma.knowledgeInsight.findFirst({
      where: { id, research_project: { user_uuid: userId } },
      include: {
        citations: { include: { post: true, comment: true } },
        topic: true,
      },
    });

    if (!insight) throw new NotFoundException('Knowledge insight not found');

    return insight;
  }
}
