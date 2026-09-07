import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { AuthRole } from 'generated/prisma';
import { AdminResearchService } from './admin-research.service';
import {
  AdminResearchProjectsQuerySchema,
  AdminResearchProjectsQueryType,
} from './dto/admin-research-projects-query.schema';
import {
  AdminAnalysisJobsQuerySchema,
  AdminAnalysisJobsQueryType,
} from './dto/admin-analysis-jobs-query.schema';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRole.ADMIN, AuthRole.SUPER_ADMIN)
@Controller('admin')
export class AdminResearchController {
  constructor(private readonly adminResearchService: AdminResearchService) {}

  @Get('stats')
  @ApiOperation({
    summary: '[Admin] Platform-wide usage, token and cost overview',
  })
  @ApiResponse({ status: 200, description: 'Stats returned' })
  getStats() {
    return this.adminResearchService.getStats();
  }

  @Get('research-projects')
  @ApiOperation({ summary: '[Admin] List research projects across all users' })
  @ApiResponse({ status: 200, description: 'Paginated list of research projects' })
  findAllProjects(
    @Query(new ZodValidationPipe(AdminResearchProjectsQuerySchema))
    query: AdminResearchProjectsQueryType,
  ) {
    return this.adminResearchService.findAllProjects(query);
  }

  @Get('analysis-jobs')
  @ApiOperation({ summary: '[Admin] List analysis jobs across all users' })
  @ApiResponse({ status: 200, description: 'Paginated list of analysis jobs' })
  findAllJobs(
    @Query(new ZodValidationPipe(AdminAnalysisJobsQuerySchema))
    query: AdminAnalysisJobsQueryType,
  ) {
    return this.adminResearchService.findAllJobs(query);
  }
}
