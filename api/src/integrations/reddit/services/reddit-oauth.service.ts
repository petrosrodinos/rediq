import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { RedditConfig } from '../config/reddit.config';

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

/**
 * App-only ("client_credentials") OAuth for Reddit's API. This grant reads
 * public data only (no Reddit user login required) but gets a much higher,
 * stable rate limit than unauthenticated www.reddit.com requests, which
 * Reddit throttles/blocks aggressively for scraping-shaped traffic.
 */
@Injectable()
export class RedditOAuthService {
  private readonly logger = new Logger(RedditOAuthService.name);
  private cachedToken: CachedToken | null = null;
  private pendingRequest: Promise<string> | null = null;

  constructor(private readonly redditConfig: RedditConfig) {}

  async getAccessToken(): Promise<string> {
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now()) {
      return this.cachedToken.accessToken;
    }

    if (!this.pendingRequest) {
      this.pendingRequest = this.fetchAccessToken().finally(() => {
        this.pendingRequest = null;
      });
    }

    return this.pendingRequest;
  }

  /** Call after a 401 from oauth.reddit.com so the next request fetches a fresh token. */
  invalidateToken(): void {
    this.cachedToken = null;
  }

  private async fetchAccessToken(): Promise<string> {
    const clientId = this.redditConfig.getClientId();
    const clientSecret = this.redditConfig.getClientSecret();

    if (!clientId || !clientSecret) {
      throw new Error('Reddit OAuth credentials are not configured.');
    }

    try {
      const response = await axios.post<{
        access_token: string;
        expires_in: number;
      }>(
        'https://www.reddit.com/api/v1/access_token',
        new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
        {
          auth: { username: clientId, password: clientSecret },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': this.redditConfig.getUserAgent(),
          },
          timeout: 10000,
        },
      );

      const { access_token, expires_in } = response.data;
      // Refresh a minute early so an in-flight request never races an expiring token.
      this.cachedToken = {
        accessToken: access_token,
        expiresAt: Date.now() + Math.max(expires_in - 60, 30) * 1000,
      };

      return access_token;
    } catch (error) {
      this.cachedToken = null;
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to obtain a Reddit OAuth access token: ${message}`,
      );
      throw new Error('Failed to authenticate with Reddit.');
    }
  }
}
