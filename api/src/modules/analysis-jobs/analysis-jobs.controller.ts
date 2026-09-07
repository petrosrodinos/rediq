import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { AnalysisJobsService } from './analysis-jobs.service';
import { BatchSubmissionsService } from './batch-submissions.service';
import { JobEventsService } from './job-events.service';
import { CreateAnalysisJobDto } from './dto/create-analysis-job.dto';
import {
  AnalysisJobsQuerySchema,
  AnalysisJobsQueryType,
} from './dto/analysis-jobs-query.schema';
import {
  BatchSubmissionsQuerySchema,
  BatchSubmissionsQueryType,
} from './dto/batch-submissions-query.schema';
import {
  JobEventsQuerySchema,
  JobEventsQueryType,
} from './dto/job-events-query.schema';

@ApiTags('analysis-jobs')
@UseGuards(JwtGuard)
@Controller('research-projects/:researchProjectId/analysis-jobs')
export class AnalysisJobsController {
  constructor(private readonly analysisJobsService: AnalysisJobsService) {}

  @Post()
  @ApiOperation({ summary: 'Start a new analysis job for a research project' })
  @ApiResponse({ status: 201, description: 'Analysis job created and queued' })
  create(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Body() dto: CreateAnalysisJobDto,
  ) {
    return this.analysisJobsService.create(userId, researchProjectId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List analysis jobs for a research project' })
  @ApiResponse({ status: 200, description: 'Analysis jobs returned' })
  findAll(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Query(new ZodValidationPipe(AnalysisJobsQuerySchema))
    query: AnalysisJobsQueryType,
  ) {
    return this.analysisJobsService.findAll(userId, researchProjectId, query);
  }
}

@ApiTags('analysis-jobs')
@UseGuards(JwtGuard)
@Controller('analysis-jobs')
export class AnalysisJobItemController {
  constructor(
    private readonly analysisJobsService: AnalysisJobsService,
    private readonly batchSubmissionsService: BatchSubmissionsService,
    private readonly jobEventsService: JobEventsService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get an analysis job' })
  @ApiResponse({ status: 200, description: 'Analysis job returned' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.analysisJobsService.findOne(userId, id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a running analysis job' })
  @ApiResponse({ status: 200, description: 'Analysis job cancelled' })
  cancel(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.analysisJobsService.cancel(userId, id);
  }

  @Get(':id/batch-submissions')
  @ApiOperation({ summary: 'List batch submissions for an analysis job' })
  @ApiResponse({ status: 200, description: 'Batch submissions returned' })
  findBatchSubmissions(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Query(new ZodValidationPipe(BatchSubmissionsQuerySchema))
    query: BatchSubmissionsQueryType,
  ) {
    return this.batchSubmissionsService.findAll(userId, id, query);
  }

  @Get(':id/events')
  @ApiOperation({
    summary: 'List the timestamped pipeline event log for an analysis job',
  })
  @ApiResponse({ status: 200, description: 'Job events returned' })
  findJobEvents(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Query(new ZodValidationPipe(JobEventsQuerySchema))
    query: JobEventsQueryType,
  ) {
    return this.jobEventsService.findAll(userId, id, query);
  }
}
