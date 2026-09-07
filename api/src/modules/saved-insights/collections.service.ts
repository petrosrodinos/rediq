import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CreateSavedInsightCollectionDto } from './dto/create-saved-insight-collection.dto';
import { UpdateSavedInsightCollectionDto } from './dto/update-saved-insight-collection.dto';

@Injectable()
export class SavedInsightCollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSavedInsightCollectionDto) {
    try {
      return await this.prisma.savedInsightCollection.create({
        data: { user_uuid: userId, name: dto.name },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('A collection with this name already exists');
      }
      throw error;
    }
  }

  async findAll(userId: string) {
    const collections = await this.prisma.savedInsightCollection.findMany({
      where: { user_uuid: userId },
      include: { _count: { select: { saved_insights: true } } },
      orderBy: { name: 'asc' },
    });

    return collections.map(({ _count, ...collection }) => ({
      ...collection,
      saved_insight_count: _count.saved_insights,
    }));
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateSavedInsightCollectionDto,
  ) {
    await this.ensureOwnership(userId, id);

    try {
      return await this.prisma.savedInsightCollection.update({
        where: { id },
        data: { name: dto.name },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('A collection with this name already exists');
      }
      throw error;
    }
  }

  async remove(userId: string, id: string) {
    await this.ensureOwnership(userId, id);

    await this.prisma.savedInsightCollection.delete({ where: { id } });
    return { success: true };
  }

  private async ensureOwnership(userId: string, id: string) {
    const collection = await this.prisma.savedInsightCollection.findFirst({
      where: { id, user_uuid: userId },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }
}
