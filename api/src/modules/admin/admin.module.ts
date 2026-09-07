import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { ANALYSIS_QUEUE_NAME } from '@/core/queues/queues.constants';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { AdminResearchController } from './admin-research.controller';
import { AdminResearchService } from './admin-research.service';
import { AdminSystemController } from './admin-system.controller';
import { AdminSystemService } from './admin-system.service';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: ANALYSIS_QUEUE_NAME }),
  ],
  controllers: [
    AdminUsersController,
    AdminResearchController,
    AdminSystemController,
  ],
  providers: [AdminUsersService, AdminResearchService, AdminSystemService],
})
export class AdminModule {}
