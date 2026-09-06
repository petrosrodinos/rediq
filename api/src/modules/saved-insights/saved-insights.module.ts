import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { SavedInsightsController } from './saved-insights.controller';
import { SavedInsightsService } from './saved-insights.service';

@Module({
  imports: [PrismaModule],
  controllers: [SavedInsightsController],
  providers: [SavedInsightsService],
  exports: [SavedInsightsService],
})
export class SavedInsightsModule {}
