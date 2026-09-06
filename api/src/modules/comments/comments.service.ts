import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CommentQueryType } from './dto/comment-query.schema';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, postId: string, query: CommentQueryType) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, research_project: { user_uuid: userId } },
    });

    if (!post) throw new NotFoundException('Post not found');

    const where = {
      post_uuid: postId,
      ...(query.min_score !== undefined && { score: { gte: query.min_score } }),
    };

    const [items, count] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
      }),
      this.prisma.comment.count({ where }),
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
    const comment = await this.prisma.comment.findFirst({
      where: { id, research_project: { user_uuid: userId } },
      include: {
        replies: {
          orderBy: { score: 'desc' },
        },
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    return comment;
  }
}
