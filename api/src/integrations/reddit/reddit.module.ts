import { Logger, Module } from '@nestjs/common';
import { RedditService } from './services/reddit.service';
import { RedditOAuthService } from './services/reddit-oauth.service';
import { RedditConfig } from './config/reddit.config';

@Module({
  imports: [],
  providers: [RedditService, RedditOAuthService, RedditConfig, Logger],
  exports: [RedditService],
})
export class RedditIntegrationModule {}
