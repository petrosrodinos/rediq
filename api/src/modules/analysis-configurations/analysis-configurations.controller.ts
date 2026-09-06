import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { AnalysisConfigurationsService } from './analysis-configurations.service';
import { CreateAnalysisConfigurationDto } from './dto/create-analysis-configuration.dto';
import { UpdateAnalysisConfigurationDto } from './dto/update-analysis-configuration.dto';
import {
  AnalysisConfigurationsQuerySchema,
  AnalysisConfigurationsQueryType,
} from './dto/analysis-configurations-query.schema';

@ApiTags('analysis-configurations')
@UseGuards(JwtGuard)
@Controller('research-projects/:researchProjectId/analysis-configurations')
export class AnalysisConfigurationsController {
  constructor(
    private readonly analysisConfigurationsService: AnalysisConfigurationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new analysis configuration for a research project',
  })
  @ApiResponse({ status: 201, description: 'Analysis configuration created' })
  create(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Body() dto: CreateAnalysisConfigurationDto,
  ) {
    return this.analysisConfigurationsService.create(
      userId,
      researchProjectId,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'List analysis configurations for a research project',
  })
  @ApiResponse({ status: 200, description: 'Analysis configurations returned' })
  findAll(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Query(new ZodValidationPipe(AnalysisConfigurationsQuerySchema))
    query: AnalysisConfigurationsQueryType,
  ) {
    return this.analysisConfigurationsService.findAll(
      userId,
      researchProjectId,
      query,
    );
  }
}

@ApiTags('analysis-configurations')
@UseGuards(JwtGuard)
@Controller('analysis-configurations')
export class AnalysisConfigurationItemController {
  constructor(
    private readonly analysisConfigurationsService: AnalysisConfigurationsService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get an analysis configuration' })
  @ApiResponse({ status: 200, description: 'Analysis configuration returned' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.analysisConfigurationsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Update an analysis configuration (only before it is used by a job)',
  })
  @ApiResponse({ status: 200, description: 'Analysis configuration updated' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAnalysisConfigurationDto,
  ) {
    return this.analysisConfigurationsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Delete an analysis configuration (only before it is used by a job)',
  })
  @ApiResponse({ status: 200, description: 'Analysis configuration deleted' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.analysisConfigurationsService.remove(userId, id);
  }
}
