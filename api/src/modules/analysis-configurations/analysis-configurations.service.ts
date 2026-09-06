import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CreateAnalysisConfigurationDto } from './dto/create-analysis-configuration.dto';
import { UpdateAnalysisConfigurationDto } from './dto/update-analysis-configuration.dto';
import { AnalysisConfigurationsQueryType } from './dto/analysis-configurations-query.schema';

@Injectable()
export class AnalysisConfigurationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureProjectOwnership(
    userId: string,
    researchProjectId: string,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: researchProjectId, user_uuid: userId },
    });
    if (!project) throw new NotFoundException('Research project not found');
    return project;
  }

  async create(
    userId: string,
    researchProjectId: string,
    dto: CreateAnalysisConfigurationDto,
  ) {
    await this.ensureProjectOwnership(userId, researchProjectId);

    return this.prisma.analysisConfiguration.create({
      data: {
        research_project_uuid: researchProjectId,
        ...dto,
      },
    });
  }

  async findAll(
    userId: string,
    researchProjectId: string,
    query: AnalysisConfigurationsQueryType,
  ) {
    await this.ensureProjectOwnership(userId, researchProjectId);

    const where = { research_project_uuid: researchProjectId };

    const [items, count] = await Promise.all([
      this.prisma.analysisConfiguration.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
      }),
      this.prisma.analysisConfiguration.count({ where }),
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
    const configuration = await this.prisma.analysisConfiguration.findFirst({
      where: { id, research_project: { user_uuid: userId } },
    });
    if (!configuration)
      throw new NotFoundException('Analysis configuration not found');
    return configuration;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateAnalysisConfigurationDto,
  ) {
    const configuration = await this.findOne(userId, id);

    const job = await this.prisma.analysisJob.findUnique({
      where: { analysis_configuration_uuid: configuration.id },
    });
    if (job) {
      throw new ConflictException(
        'This configuration is already attached to an analysis job and can no longer be edited',
      );
    }

    return this.prisma.analysisConfiguration.update({
      where: { id: configuration.id },
      data: { ...dto },
    });
  }

  async remove(userId: string, id: string) {
    const configuration = await this.findOne(userId, id);

    const job = await this.prisma.analysisJob.findUnique({
      where: { analysis_configuration_uuid: configuration.id },
    });
    if (job) {
      throw new ConflictException(
        'This configuration is already attached to an analysis job and cannot be deleted',
      );
    }

    await this.prisma.analysisConfiguration.delete({
      where: { id: configuration.id },
    });
    return configuration;
  }
}
