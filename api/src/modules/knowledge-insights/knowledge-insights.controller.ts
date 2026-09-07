import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { KnowledgeInsightsService } from './knowledge-insights.service';
import {
  KnowledgeInsightQuerySchema,
  KnowledgeInsightQueryType,
} from './dto/knowledge-insight-query.schema';

@ApiTags('knowledge-insights')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class KnowledgeInsightsController {
  constructor(
    private readonly knowledgeInsightsService: KnowledgeInsightsService,
  ) {}

  @Get('research-projects/:researchProjectId/knowledge-insights')
  @ApiOperation({
    summary: 'List extracted knowledge insights for a research project',
  })
  @ApiParam({ name: 'researchProjectId', description: 'Research project id' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'sentiment', required: false })
  @ApiQuery({ name: 'topic_uuid', required: false })
  @ApiQuery({ name: 'min_confidence', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'order_by', required: false })
  @ApiQuery({ name: 'order_direction', required: false })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of knowledge insights',
  })
  findAll(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Query(new ZodValidationPipe(KnowledgeInsightQuerySchema))
    query: KnowledgeInsightQueryType,
  ) {
    return this.knowledgeInsightsService.findAll(
      userId,
      researchProjectId,
      query,
    );
  }

  @Get('knowledge-insights/:id')
  @ApiOperation({
    summary: 'Get a single knowledge insight with its citations',
  })
  @ApiParam({ name: 'id', description: 'Knowledge insight id' })
  @ApiResponse({ status: 200, description: 'Knowledge insight found' })
  @ApiResponse({ status: 404, description: 'Knowledge insight not found' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.knowledgeInsightsService.findOne(userId, id);
  }
}
