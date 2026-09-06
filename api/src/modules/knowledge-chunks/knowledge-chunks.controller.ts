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
import { KnowledgeChunksService } from './knowledge-chunks.service';
import {
  KnowledgeChunkQuerySchema,
  KnowledgeChunkQueryType,
} from './dto/knowledge-chunk-query.schema';

@ApiTags('knowledge-chunks')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class KnowledgeChunksController {
  constructor(
    private readonly knowledgeChunksService: KnowledgeChunksService,
  ) {}

  @Get('research-projects/:researchProjectId/knowledge-chunks')
  @ApiOperation({
    summary: 'List raw knowledge chunks stored for a research project',
  })
  @ApiParam({ name: 'researchProjectId', description: 'Research project id' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of knowledge chunks',
  })
  findAll(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Query(new ZodValidationPipe(KnowledgeChunkQuerySchema))
    query: KnowledgeChunkQueryType,
  ) {
    return this.knowledgeChunksService.findAll(
      userId,
      researchProjectId,
      query,
    );
  }
}
