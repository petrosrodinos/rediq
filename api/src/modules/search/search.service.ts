import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { SemanticSearchService } from './services/semantic-search.service';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly semanticSearchService: SemanticSearchService,
  ) {}

  async search(userId: string, researchProjectId: string, dto: SearchDto) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: researchProjectId, user_uuid: userId },
    });

    if (!project) throw new NotFoundException('Research project not found');

    return this.semanticSearchService.findSimilar(
      researchProjectId,
      dto.query,
      {
        limit: dto.limit,
        types: dto.types,
      },
    );
  }
}
