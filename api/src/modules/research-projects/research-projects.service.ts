import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { RedditService } from '@/integrations/reddit/services/reddit.service';
import { SentimentLabel } from 'generated/prisma';
import { CreateResearchProjectDto } from './dto/create-research-project.dto';
import { UpdateResearchProjectDto } from './dto/update-research-project.dto';
import { ResearchProjectsQueryType } from './dto/research-projects-query.schema';

const RESEARCH_PROJECT_INCLUDE = {
  source: true,
  analysis_configurations: {
    orderBy: { created_at: 'desc' as const },
    take: 1,
  },
  analysis_jobs: {
    orderBy: { created_at: 'desc' as const },
    take: 1,
  },
};

@Injectable()
export class ResearchProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redditService: RedditService,
  ) {}

  async create(userId: string, dto: CreateResearchProjectDto) {
    const urlInfo = this.redditService.parseUrl(dto.url);

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.researchProject.create({
        data: {
          user_uuid: userId,
          name: dto.name,
        },
      });

      const source = await tx.researchSource.create({
        data: {
          research_project_uuid: project.id,
          source_type: urlInfo.sourceType,
          url: dto.url,
          community: urlInfo.community,
          external_post_id: urlInfo.externalPostId,
        },
      });

      const configuration = await tx.analysisConfiguration.create({
        data: {
          research_project_uuid: project.id,
          ...dto.configuration,
        },
      });

      return { ...project, source, analysis_configurations: [configuration] };
    });
  }

  async findAll(userId: string, query: ResearchProjectsQueryType) {
    const where = {
      user_uuid: userId,
      ...(query.search && {
        name: { contains: query.search, mode: 'insensitive' as const },
      }),
      ...(query.status && { status: query.status }),
    };

    const [items, count] = await Promise.all([
      this.prisma.researchProject.findMany({
        where,
        include: RESEARCH_PROJECT_INCLUDE,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
      }),
      this.prisma.researchProject.count({ where }),
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
    const project = await this.prisma.researchProject.findFirst({
      where: { id, user_uuid: userId },
      include: RESEARCH_PROJECT_INCLUDE,
    });

    if (!project) throw new NotFoundException('Research project not found');
    return project;
  }

  async update(userId: string, id: string, dto: UpdateResearchProjectDto) {
    await this.ensureOwnership(userId, id);

    return this.prisma.researchProject.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async remove(userId: string, id: string) {
    const project = await this.ensureOwnership(userId, id);

    await this.prisma.researchProject.delete({ where: { id } });
    return project;
  }

  /**
   * Recomputes the cached sentiment mix from this project's KnowledgeInsight rows.
   * Insights with no sentiment set are excluded from the denominator entirely
   * rather than counted as neutral, so the percentages only reflect insights the
   * AI pipeline actually scored.
   */
  async recalculateSentiment(userId: string, id: string) {
    await this.ensureOwnership(userId, id);

    const counts = await this.prisma.knowledgeInsight.groupBy({
      by: ['sentiment'],
      where: { research_project_uuid: id, sentiment: { not: null } },
      _count: { sentiment: true },
    });

    const total = counts.reduce((sum, row) => sum + row._count.sentiment, 0);
    const countFor = (label: SentimentLabel) =>
      counts.find((row) => row.sentiment === label)?._count.sentiment ?? 0;

    const percentages =
      total === 0
        ? {
            sentiment_positive_pct: null,
            sentiment_neutral_pct: null,
            sentiment_negative_pct: null,
          }
        : {
            sentiment_positive_pct:
              (countFor(SentimentLabel.POSITIVE) / total) * 100,
            sentiment_neutral_pct:
              (countFor(SentimentLabel.NEUTRAL) / total) * 100,
            sentiment_negative_pct:
              (countFor(SentimentLabel.NEGATIVE) / total) * 100,
          };

    return this.prisma.researchProject.update({
      where: { id },
      data: percentages,
    });
  }

  private async ensureOwnership(userId: string, id: string) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id, user_uuid: userId },
    });
    if (!project) throw new NotFoundException('Research project not found');
    return project;
  }
}
