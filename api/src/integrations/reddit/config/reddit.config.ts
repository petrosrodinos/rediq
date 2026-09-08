import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_USER_AGENT = 'rediq/1.0 (by /u/rediq-app)';

@Injectable()
export class RedditConfig {
  private readonly logger = new Logger(RedditConfig.name);

  constructor(private readonly configService: ConfigService) {
    if (this.hasOAuthCredentials()) {
      this.logger.log(
        'Reddit OAuth credentials configured; using oauth.reddit.com',
      );
    } else {
      this.logger.warn(
        'REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET are not configured; falling back to unauthenticated www.reddit.com requests (low, unreliable rate limits)',
      );
    }
  }

  getUserAgent(): string {
    return (
      this.configService.get<string>('REDDIT_USER_AGENT') || DEFAULT_USER_AGENT
    );
  }

  getClientId(): string | undefined {
    return this.configService.get<string>('REDDIT_CLIENT_ID') || undefined;
  }

  getClientSecret(): string | undefined {
    return this.configService.get<string>('REDDIT_CLIENT_SECRET') || undefined;
  }

  hasOAuthCredentials(): boolean {
    return !!this.getClientId() && !!this.getClientSecret();
  }
}
