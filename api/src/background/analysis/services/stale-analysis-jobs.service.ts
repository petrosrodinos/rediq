import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AnalysisStatus } from 'generated/prisma';

// analysis.processor.ts always resolves its BullMQ job (even a caught failure goes
// through fail(), not a rejection), and there is no per-step timeout on the pipeline's
// external calls (Reddit, OpenAI). If the worker process dies or a call hangs mid-step,
// the job is left in a non-terminal status forever with nothing to notice or recover it.
// This sweep is the backstop: a job with no status/progress update in a while is
// considered dead and flipped to FAILED so the dashboard stops polling and the user can retry.
const STALE_THRESHOLD_MINUTES = 30;

const TERMINAL_STATUSES: AnalysisStatus[] = [
  AnalysisStatus.COMPLETED,
  AnalysisStatus.FAILED,
];

@Injectable()
export class StaleAnalysisJobsService {
  private readonly logger = new Logger(StaleAnalysisJobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async failStaleJobs(): Promise<void> {
    const staleBefore = new Date(
      Date.now() - STALE_THRESHOLD_MINUTES * 60 * 1000,
    );

    const staleJobs = await this.prisma.analysisJob.findMany({
      where: {
        status: { notIn: TERMINAL_STATUSES },
        updated_at: { lt: staleBefore },
      },
      select: { id: true, research_project_uuid: true, current_step: true },
    });

    for (const job of staleJobs) {
      this.logger.warn(
        `Analysis job ${job.id} stuck at "${job.current_step}" with no progress for over ${STALE_THRESHOLD_MINUTES} minutes, marking as failed`,
      );

      await Promise.all([
        this.prisma.analysisJob.update({
          where: { id: job.id },
          data: {
            status: AnalysisStatus.FAILED,
            error_message: `Analysis timed out: no progress for over ${STALE_THRESHOLD_MINUTES} minutes`,
            completed_at: new Date(),
          },
        }),
        this.prisma.researchProject.update({
          where: { id: job.research_project_uuid },
          data: { status: AnalysisStatus.FAILED },
        }),
      ]);
    }
  }
}
