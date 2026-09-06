import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { BatchSubmissionsQueryType } from './dto/batch-submissions-query.schema';

@Injectable()
export class BatchSubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    analysisJobId: string,
    query: BatchSubmissionsQueryType,
  ) {
    const job = await this.prisma.analysisJob.findFirst({
      where: { id: analysisJobId, research_project: { user_uuid: userId } },
    });
    if (!job) throw new NotFoundException('Analysis job not found');

    const where = { analysis_job_uuid: analysisJobId };

    const [items, count] = await Promise.all([
      this.prisma.batchSubmission.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
      }),
      this.prisma.batchSubmission.count({ where }),
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
