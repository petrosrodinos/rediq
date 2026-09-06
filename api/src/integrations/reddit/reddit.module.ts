import { Logger, Module } from '@nestjs/common';
import { RedditService } from './services/reddit.service';
import { RedditConfig } from './config/reddit.config';

@Module({
  imports: [],
  providers: [RedditService, RedditConfig, Logger],
  exports: [RedditService],
})
export class RedditIntegrationModule {}
