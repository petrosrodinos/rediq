import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { KnowledgeChunksController } from './knowledge-chunks.controller';
import { KnowledgeChunksService } from './knowledge-chunks.service';

@Module({
  imports: [PrismaModule],
  controllers: [KnowledgeChunksController],
  providers: [KnowledgeChunksService],
  exports: [KnowledgeChunksService],
})
export class KnowledgeChunksModule {}
