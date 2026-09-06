import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { KnowledgeInsightsController } from './knowledge-insights.controller';
import { KnowledgeInsightsService } from './knowledge-insights.service';

@Module({
  imports: [PrismaModule],
  controllers: [KnowledgeInsightsController],
  providers: [KnowledgeInsightsService],
  exports: [KnowledgeInsightsService],
})
export class KnowledgeInsightsModule {}
