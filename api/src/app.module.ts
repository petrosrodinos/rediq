import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './modules/internal/mail/mail.module';
import { SmsModule } from './modules/internal/sms/sms.module';
import { AiModule } from './modules/internal/ai/ai.module';
import { RedisModule } from './core/databases/redis/redis.module';
import { RedisCacheModule } from './modules/internal/redis-cache/redis-cache.module';
import { QueuesModule } from './core/queues/queues.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule } from './shared/config/env/env.module';
import { UsersModule } from './modules/users/users.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ResearchProjectsModule } from './modules/research-projects/research-projects.module';
import { AnalysisConfigurationsModule } from './modules/analysis-configurations/analysis-configurations.module';
import { AnalysisJobsModule } from './modules/analysis-jobs/analysis-jobs.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TopicsModule } from './modules/topics/topics.module';
import { KnowledgeInsightsModule } from './modules/knowledge-insights/knowledge-insights.module';
import { KnowledgeChunksModule } from './modules/knowledge-chunks/knowledge-chunks.module';
import { SearchModule } from './modules/search/search.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { SavedInsightsModule } from './modules/saved-insights/saved-insights.module';
import { ExportModule } from './modules/export/export.module';
import { AnalysisPipelineModule } from './background/analysis/analysis-pipeline.module';

@Module({
  imports: [
    ConfigModule,
    MailModule,
    SmsModule,
    AiModule,
    RedisModule,
    RedisCacheModule,
    QueuesModule,
    // GraphQLModule,
    AuthModule,
    HealthModule,
    UsersModule,
    DocumentsModule,
    ResearchProjectsModule,
    AnalysisConfigurationsModule,
    AnalysisJobsModule,
    PostsModule,
    CommentsModule,
    TopicsModule,
    KnowledgeInsightsModule,
    KnowledgeChunksModule,
    SearchModule,
    ConversationsModule,
    SavedInsightsModule,
    ExportModule,
    AnalysisPipelineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
