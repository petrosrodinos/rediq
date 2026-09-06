import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { ANALYSIS_QUEUE_NAME } from '@/core/queues/queues.constants';
import {
  AnalysisJobItemController,
  AnalysisJobsController,
} from './analysis-jobs.controller';
import { AnalysisJobsService } from './analysis-jobs.service';
import { BatchSubmissionsService } from './batch-submissions.service';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: ANALYSIS_QUEUE_NAME }),
  ],
  controllers: [AnalysisJobsController, AnalysisJobItemController],
  providers: [AnalysisJobsService, BatchSubmissionsService],
  exports: [AnalysisJobsService, BatchSubmissionsService],
})
export class AnalysisJobsModule {}
