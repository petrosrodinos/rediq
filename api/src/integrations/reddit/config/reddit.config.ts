import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_USER_AGENT = 'rediq/1.0 (by /u/rediq-app)';

@Injectable()
export class RedditConfig {
  constructor(private readonly configService: ConfigService) {}

  getUserAgent(): string {
    return (
      this.configService.get<string>('REDDIT_USER_AGENT') || DEFAULT_USER_AGENT
    );
  }
}
