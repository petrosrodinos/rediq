import { Logger, Module } from '@nestjs/common';
import { RedditService } from './services/reddit.service';
import { RedditOAuthService } from './services/reddit-oauth.service';
import { BrightDataClientService } from './services/bright-data-client.service';
import { BrightDataRedditService } from './services/bright-data-reddit.service';
import { ApifyClientService } from './services/apify-client.service';
import { ApifyRedditService } from './services/apify-reddit.service';
import { RedditConfig } from './config/reddit.config';
import { BrightDataConfig } from './config/bright-data.config';
import { ApifyConfig } from './config/apify.config';

@Module({
  imports: [],
  providers: [
    RedditService,
    RedditOAuthService,
    RedditConfig,
    BrightDataClientService,
    BrightDataRedditService,
    BrightDataConfig,
    ApifyClientService,
    ApifyRedditService,
    ApifyConfig,
    Logger,
  ],
  exports: [RedditService],
})
export class RedditIntegrationModule {}
