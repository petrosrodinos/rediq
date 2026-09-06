import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { RedditIntegrationModule } from '@/integrations/reddit/reddit.module';
import { ResearchProjectsController } from './research-projects.controller';
import { ResearchProjectsService } from './research-projects.service';

@Module({
  imports: [PrismaModule, RedditIntegrationModule],
  controllers: [ResearchProjectsController],
  providers: [ResearchProjectsService],
  exports: [ResearchProjectsService],
})
export class ResearchProjectsModule {}
