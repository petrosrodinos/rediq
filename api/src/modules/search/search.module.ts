import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AiIntegrationModule } from '@/integrations/ai/ai.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SemanticSearchService } from './services/semantic-search.service';

@Module({
  imports: [PrismaModule, AiIntegrationModule],
  controllers: [SearchController],
  providers: [SearchService, SemanticSearchService],
  exports: [SemanticSearchService],
})
export class SearchModule {}
