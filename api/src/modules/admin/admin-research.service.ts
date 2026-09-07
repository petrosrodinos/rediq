import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AdminResearchProjectsQueryType } from './dto/admin-research-projects-query.schema';
import { AdminAnalysisJobsQueryType } from './dto/admin-analysis-jobs-query.schema';

@Injectable()
export class AdminResearchService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProjects(query: AdminResearchProjectsQueryType) {
    const where = {
      ...(query.status && { status: query.status }),
      ...(query.search && {
        name: { contains: query.search, mode: 'insensitive' as const },
      }),
    };

    const [items, count] = await Promise.all([
      this.prisma.researchProject.findMany({
        where,
        include: {
          user: { select: { id: true, email: true } },
          source: true,
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
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

  async findAllJobs(query: AdminAnalysisJobsQueryType) {
    const where = {
      ...(query.status && { status: query.status }),
      ...(query.processing_mode && {
        configuration: { processing_mode: query.processing_mode },
      }),
    };

    const [items, count] = await Promise.all([
      this.prisma.analysisJob.findMany({
        where,
        include: {
          configuration: true,
          research_project: {
            select: {
              id: true,
              name: true,
              user: { select: { id: true, email: true } },
            },
          },
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.analysisJob.count({ where }),
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

  async getStats() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      usersCount,
      researchProjectsCount,
      analysisJobsCount,
      tokenAndCostAgg,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.researchProject.count(),
      this.prisma.analysisJob.count(),
      this.prisma.analysisJob.aggregate({
        where: { created_at: { gte: startOfMonth } },
        _sum: {
          prompt_tokens: true,
          completion_tokens: true,
          estimated_cost_usd: true,
          actual_cost_usd: true,
        },
      }),
    ]);

    const promptTokens = tokenAndCostAgg._sum.prompt_tokens ?? 0;
    const completionTokens = tokenAndCostAgg._sum.completion_tokens ?? 0;

    return {
      users_count: usersCount,
      research_projects_count: researchProjectsCount,
      analysis_jobs_count: analysisJobsCount,
      tokens_this_month: promptTokens + completionTokens,
      // Kept separate rather than merged: actual_cost_usd is only populated
      // once a job reconciles, so summing the two together would silently
      // undercount cost for a month with jobs still in flight.
      estimated_cost_usd_this_month: tokenAndCostAgg._sum.estimated_cost_usd ?? 0,
      actual_cost_usd_this_month: tokenAndCostAgg._sum.actual_cost_usd ?? 0,
    };
  }
}
