import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { TopicQueryType } from './dto/topic-query.schema';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    researchProjectId: string,
    query: TopicQueryType,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: researchProjectId, user_uuid: userId },
    });

    if (!project) throw new NotFoundException('Research project not found');

    const where = {
      research_project_uuid: researchProjectId,
      ...(query.search && {
        name: { contains: query.search, mode: 'insensitive' as const },
      }),
    };

    const [items, count] = await Promise.all([
      this.prisma.topic.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
        include: { _count: { select: { knowledge_insights: true } } },
      }),
      this.prisma.topic.count({ where }),
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
    const topic = await this.prisma.topic.findFirst({
      where: { id, research_project: { user_uuid: userId } },
      include: {
        knowledge_insights: {
          include: { citations: true },
        },
      },
    });

    if (!topic) throw new NotFoundException('Topic not found');

    return topic;
  }
}
