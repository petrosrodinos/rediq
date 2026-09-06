import { BadRequestException } from '@nestjs/common';
import { RedditUrlInfo } from '../interfaces/reddit.interfaces';

const COMMUNITY_URL_REGEX = /reddit\.com\/r\/([A-Za-z0-9_]+)\/?$/i;
const POST_URL_REGEX =
  /reddit\.com\/r\/([A-Za-z0-9_]+)\/comments\/([A-Za-z0-9]+)(?:\/[^/?#]*)?/i;

export function parseRedditUrl(url: string): RedditUrlInfo {
  if (!url || typeof url !== 'string') {
    throw new BadRequestException('A Reddit URL is required');
  }

  let normalized: string;
  try {
    const parsed = new URL(url.trim());
    if (!/(^|\.)reddit\.com$/i.test(parsed.hostname)) {
      throw new BadRequestException(
        'URL must be a reddit.com community or post URL',
      );
    }
    normalized = `${parsed.hostname}${parsed.pathname}`;
  } catch {
    throw new BadRequestException('Invalid URL');
  }

  const postMatch = normalized.match(POST_URL_REGEX);
  if (postMatch) {
    return {
      sourceType: 'THREAD',
      community: postMatch[1],
      externalPostId: postMatch[2],
    };
  }

  const communityMatch = normalized.match(COMMUNITY_URL_REGEX);
  if (communityMatch) {
    return {
      sourceType: 'COMMUNITY',
      community: communityMatch[1],
    };
  }

  throw new BadRequestException(
    'URL must be a subreddit URL (e.g. https://www.reddit.com/r/startups) or a post URL (e.g. https://www.reddit.com/r/startups/comments/xxxxx/example_post)',
  );
}
