import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';
import { SavedSearchQueryType } from './dto/saved-search-query.schema';

@Injectable()
export class SavedSearchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSavedSearchDto) {
    if (dto.research_project_uuid) {
      const project = await this.prisma.researchProject.findFirst({
        where: { id: dto.research_project_uuid, user_uuid: userId },
      });
      if (!project) throw new NotFoundException('Research project not found');
    }

    return this.prisma.savedSearch.create({
      data: {
        user_uuid: userId,
        research_project_uuid: dto.research_project_uuid ?? null,
        name: dto.name ?? null,
        query: dto.query,
        min_score: dto.min_score ?? null,
        time_range: dto.time_range ?? null,
      },
    });
  }

  async findAll(userId: string, query: SavedSearchQueryType) {
    const where = {
      user_uuid: userId,
      ...(query.research_project_uuid && {
        research_project_uuid: query.research_project_uuid,
      }),
    };

    const [items, count] = await Promise.all([
      this.prisma.savedSearch.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.savedSearch.count({ where }),
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

  async remove(userId: string, id: string) {
    const savedSearch = await this.prisma.savedSearch.findFirst({
      where: { id, user_uuid: userId },
    });
    if (!savedSearch) throw new NotFoundException('Saved search not found');

    await this.prisma.savedSearch.delete({ where: { id } });
    return { success: true };
  }
}
