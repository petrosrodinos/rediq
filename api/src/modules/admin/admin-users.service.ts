import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AdminUsersQueryType } from './dto/admin-users-query.schema';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AdminUsersQueryType) {
    const where = {
      ...(query.search && {
        OR: [
          { email: { contains: query.search, mode: 'insensitive' as const } },
          { phone: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, count] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          created_at: true,
          updated_at: true,
          _count: { select: { research_projects: true } },
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: items.map(({ _count, ...user }) => ({
        ...user,
        research_project_count: _count.research_projects,
      })),
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
        _count: { select: { research_projects: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const { _count, ...rest } = user;
    return { ...rest, research_project_count: _count.research_projects };
  }
}
