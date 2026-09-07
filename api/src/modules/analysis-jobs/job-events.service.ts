import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { JobEventsQueryType } from './dto/job-events-query.schema';

@Injectable()
export class JobEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    analysisJobId: string,
    query: JobEventsQueryType,
  ) {
    const job = await this.prisma.analysisJob.findFirst({
      where: { id: analysisJobId, research_project: { user_uuid: userId } },
    });
    if (!job) throw new NotFoundException('Analysis job not found');

    const where = {
      analysis_job_uuid: analysisJobId,
      ...(query.level && { level: query.level }),
    };

    const [items, count] = await Promise.all([
      this.prisma.jobEvent.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
      }),
      this.prisma.jobEvent.count({ where }),
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
}
