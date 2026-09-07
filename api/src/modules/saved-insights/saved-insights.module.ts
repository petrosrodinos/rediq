import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { SavedInsightsController } from './saved-insights.controller';
import { SavedInsightsService } from './saved-insights.service';
import { SavedInsightCollectionsController } from './collections.controller';
import { SavedInsightCollectionsService } from './collections.service';

@Module({
  imports: [PrismaModule],
  // NOTE: collections controller must be registered before SavedInsightsController
  // so the literal `/saved-insights/collections` route matches before the
  // `/saved-insights/:id` parameterized route would swallow it.
  controllers: [SavedInsightCollectionsController, SavedInsightsController],
  providers: [SavedInsightsService, SavedInsightCollectionsService],
  exports: [SavedInsightsService, SavedInsightCollectionsService],
})
export class SavedInsightsModule {}
