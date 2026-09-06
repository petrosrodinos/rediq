import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { RedditIntegrationModule } from '@/integrations/reddit/reddit.module';
import { AiIntegrationModule } from '@/integrations/ai/ai.module';
import { ANALYSIS_QUEUE_NAME } from '@/core/queues/queues.constants';
import { AnalysisProcessor } from './analysis.processor';
import { RedditIngestionService } from './services/reddit-ingestion.service';
import { EmbeddingsService } from './services/embeddings.service';
import { KnowledgeExtractionService } from './services/knowledge-extraction.service';

@Module({
  imports: [
    PrismaModule,
    RedditIntegrationModule,
    AiIntegrationModule,
    BullModule.registerQueue({ name: ANALYSIS_QUEUE_NAME }),
  ],
  providers: [
    AnalysisProcessor,
    RedditIngestionService,
    EmbeddingsService,
    KnowledgeExtractionService,
  ],
})
export class AnalysisPipelineModule {}
