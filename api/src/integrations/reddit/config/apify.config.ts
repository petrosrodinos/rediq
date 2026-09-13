import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Apify Store actor id for Reddit scraping (`harshmaur/reddit-scraper`). */
export const APIFY_REDDIT_ACTOR_ID = 'harshmaur~reddit-scraper';

@Injectable()
export class ApifyConfig {
  private readonly logger = new Logger(ApifyConfig.name);

  constructor(private readonly configService: ConfigService) {
    if (this.hasCredentials()) {
      this.logger.log(
        'Apify API token configured; sourcing Reddit data through Apify',
      );
    }
  }

  getApiToken(): string | undefined {
    return this.configService.get<string>('APIFY_API_TOKEN') || undefined;
  }

  /**
   * Overridable via `APIFY_REDDIT_ACTOR_ID` in case a fork/replacement actor
   * is needed later. Apify's console displays actor ids as `owner/name`, but
   * the REST API path requires `owner~name` — normalize defensively so a
   * copy-pasted slash form doesn't silently break every request.
   */
  getActorId(): string {
    const configured = this.configService.get<string>('APIFY_REDDIT_ACTOR_ID');
    return (configured || APIFY_REDDIT_ACTOR_ID).replace('/', '~');
  }

  hasCredentials(): boolean {
    return !!this.getApiToken();
  }
}
