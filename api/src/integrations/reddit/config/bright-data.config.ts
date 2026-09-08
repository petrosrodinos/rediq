import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Bright Data's Reddit "Posts" dataset (collect by URL / discover by subreddit or keyword). */
export const BRIGHT_DATA_POSTS_DATASET_ID = 'gd_lvz8ah06191smkebj4';
/** Bright Data's Reddit "Comments" dataset (collect by post/thread URL). */
export const BRIGHT_DATA_COMMENTS_DATASET_ID = 'gd_lvzdpsdlw09j6t702';

@Injectable()
export class BrightDataConfig {
  private readonly logger = new Logger(BrightDataConfig.name);

  constructor(private readonly configService: ConfigService) {
    if (this.hasCredentials()) {
      this.logger.log(
        'Bright Data API token configured; sourcing Reddit data through Bright Data',
      );
    }
  }

  getApiToken(): string | undefined {
    return this.configService.get<string>('BRIGHT_DATA_API_TOKEN') || undefined;
  }

  hasCredentials(): boolean {
    return !!this.getApiToken();
  }
}
