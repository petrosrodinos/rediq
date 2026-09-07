import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CreateSavedInsightDto } from './dto/create-saved-insight.dto';
import { UpdateSavedInsightDto } from './dto/update-saved-insight.dto';
import { SavedInsightQueryType } from './dto/saved-insight-query.schema';

const SAVED_INSIGHT_INCLUDE = {
  knowledge_insight: {
    include: {
      citations: true,
      topic: true,
    },
  },
} as const;

@Injectable()
export class SavedInsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSavedInsightDto) {
    const insight = await this.prisma.knowledgeInsight.findFirst({
      where: {
        id: dto.knowledge_insight_uuid,
        research_project: { id: dto.research_project_uuid, user_uuid: userId },
      },
    });

    if (!insight) throw new NotFoundException('Knowledge insight not found');

    if (dto.collection_uuid) {
      await this.ensureCollectionOwnership(userId, dto.collection_uuid);
    }

    try {
      return await this.prisma.savedInsight.create({
        data: {
          user_uuid: userId,
          research_project_uuid: dto.research_project_uuid,
          knowledge_insight_uuid: dto.knowledge_insight_uuid,
          collection_uuid: dto.collection_uuid ?? null,
        },
        include: SAVED_INSIGHT_INCLUDE,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Insight already saved');
      }
      throw error;
    }
  }

  async findAll(userId: string, query: SavedInsightQueryType) {
    const where = {
      user_uuid: userId,
      ...(query.research_project_uuid && {
        research_project_uuid: query.research_project_uuid,
      }),
      ...(query.collection_uuid && {
        collection_uuid: query.collection_uuid,
      }),
    };

    const [items, count] = await Promise.all([
      this.prisma.savedInsight.findMany({
        where,
        include: SAVED_INSIGHT_INCLUDE,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.savedInsight.count({ where }),
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

  async update(userId: string, id: string, dto: UpdateSavedInsightDto) {
    const savedInsight = await this.prisma.savedInsight.findFirst({
      where: { id, user_uuid: userId },
    });
    if (!savedInsight) throw new NotFoundException('Saved insight not found');

    if (dto.collection_uuid) {
      await this.ensureCollectionOwnership(userId, dto.collection_uuid);
    }

    return this.prisma.savedInsight.update({
      where: { id },
      data: { collection_uuid: dto.collection_uuid ?? null },
      include: SAVED_INSIGHT_INCLUDE,
    });
  }

  async remove(userId: string, id: string) {
    const savedInsight = await this.prisma.savedInsight.findFirst({
      where: { id, user_uuid: userId },
    });

    if (!savedInsight) throw new NotFoundException('Saved insight not found');

    await this.prisma.savedInsight.delete({ where: { id } });

    return { success: true };
  }

  private async ensureCollectionOwnership(userId: string, id: string) {
    const collection = await this.prisma.savedInsightCollection.findFirst({
      where: { id, user_uuid: userId },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }
}
