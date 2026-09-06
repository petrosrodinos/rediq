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
import { TopicsService } from './topics.service';
import { TopicQuerySchema, TopicQueryType } from './dto/topic-query.schema';

@ApiTags('topics')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('research-projects/:researchProjectId/topics')
  @ApiOperation({ summary: 'List topics identified for a research project' })
  @ApiParam({ name: 'researchProjectId', description: 'Research project id' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'order_by', required: false })
  @ApiQuery({ name: 'order_direction', required: false })
  @ApiResponse({ status: 200, description: 'Paginated list of topics' })
  findAll(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Query(new ZodValidationPipe(TopicQuerySchema)) query: TopicQueryType,
  ) {
    return this.topicsService.findAll(userId, researchProjectId, query);
  }

  @Get('topics/:id')
  @ApiOperation({ summary: 'Get a single topic with its insights' })
  @ApiParam({ name: 'id', description: 'Topic id' })
  @ApiResponse({ status: 200, description: 'Topic found' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.topicsService.findOne(userId, id);
  }
}
