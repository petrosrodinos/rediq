import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import {
  AnalysisConfigurationItemController,
  AnalysisConfigurationsController,
} from './analysis-configurations.controller';
import { AnalysisConfigurationsService } from './analysis-configurations.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    AnalysisConfigurationsController,
    AnalysisConfigurationItemController,
  ],
  providers: [AnalysisConfigurationsService],
  exports: [AnalysisConfigurationsService],
})
export class AnalysisConfigurationsModule {}
