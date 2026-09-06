import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { ExportService } from './export.service';
import { ExportQuerySchema, ExportQueryType } from './dto/export-query.schema';

@ApiTags('export')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('research-projects/:researchProjectId/export')
  @ApiOperation({
    summary:
      'Export a research project report as JSON or Markdown, preserving source citations',
  })
  @ApiQuery({ name: 'format', required: false, enum: ['json', 'markdown'] })
  @ApiResponse({ status: 200, description: 'Report exported' })
  @ApiResponse({ status: 404, description: 'Research project not found' })
  async export(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Query(new ZodValidationPipe(ExportQuerySchema)) query: ExportQueryType,
    @Res() response: Response,
  ) {
    if (query.format === 'markdown') {
      const markdown = await this.exportService.toMarkdown(
        userId,
        researchProjectId,
      );
      response.type('text/markdown').send(markdown);
      return;
    }

    const json = await this.exportService.toJson(userId, researchProjectId);
    response.type('application/json').send(json);
  }
}
