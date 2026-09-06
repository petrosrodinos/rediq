import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { PostQueryType } from './dto/post-query.schema';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    researchProjectId: string,
    query: PostQueryType,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: researchProjectId, user_uuid: userId },
    });

    if (!project) throw new NotFoundException('Research project not found');

    const where = {
      research_project_uuid: researchProjectId,
      ...(query.community && { community: query.community }),
      ...(query.min_score !== undefined && { score: { gte: query.min_score } }),
      ...(query.is_nsfw !== undefined && { is_nsfw: query.is_nsfw }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { body: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, count] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
      }),
      this.prisma.post.count({ where }),
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
    const post = await this.prisma.post.findFirst({
      where: { id, research_project: { user_uuid: userId } },
      include: {
        comments: {
          orderBy: { score: 'desc' },
          take: 20,
        },
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }
}
