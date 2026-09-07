import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ANALYSIS_QUEUE_NAME,
  AnalysisQueueJobData,
} from '@/core/queues/queues.constants';
import { JobEventLevel } from 'generated/prisma';
import { AdminSystemErrorsQueryType } from './dto/admin-system-errors-query.schema';

@Injectable()
export class AdminSystemService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(ANALYSIS_QUEUE_NAME)
    private readonly analysisQueue: Queue<AnalysisQueueJobData>,
  ) {}

  async findSystemErrors(query: AdminSystemErrorsQueryType) {
    const where = {
      level: query.level
        ? query.level
        : { in: [JobEventLevel.WARNING, JobEventLevel.ERROR] },
    };

    const [items, count] = await Promise.all([
      this.prisma.jobEvent.findMany({
        where,
        include: {
          analysis_job: {
            select: {
              id: true,
              research_project: {
                select: {
                  id: true,
                  name: true,
                  user: { select: { id: true, email: true } },
                },
              },
            },
          },
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
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

  async getQueueStatus() {
    const [counts, jobStatusCounts] = await Promise.all([
      this.analysisQueue.getJobCounts(
        'waiting',
        'active',
        'completed',
        'failed',
        'delayed',
        'paused',
      ),
      this.prisma.analysisJob.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    return {
      queue_name: ANALYSIS_QUEUE_NAME,
      // Live BullMQ counters — what the worker is actually doing right now.
      job_counts: counts,
      // A complementary, durable view: how many AnalysisJob rows sit in each
      // pipeline status, regardless of whether their queue job is still around.
      analysis_job_status_counts: Object.fromEntries(
        jobStatusCounts.map((row) => [row.status, row._count.status]),
      ),
    };
  }
}
