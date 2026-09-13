import { BadRequestException } from '@nestjs/common';
import { PostSortOrder, SourceType, TopTimeRange } from 'generated/prisma';
import { RedditUrlInfo } from '../interfaces/reddit.interfaces';

const COMMUNITY_URL_REGEX = /reddit\.com\/r\/([A-Za-z0-9_]+)\/?$/i;
const POST_URL_REGEX =
  /reddit\.com\/r\/([A-Za-z0-9_]+)\/comments\/([A-Za-z0-9]+)(?:\/[^/?#]*)?/i;

/** Reddit listing sort → its URL path segment (e.g. `/r/x/top/`). */
export const SORT_MAP: Record<PostSortOrder, string> = {
  [PostSortOrder.HOT]: 'hot',
  [PostSortOrder.TOP]: 'top',
  [PostSortOrder.NEW]: 'new',
  [PostSortOrder.RISING]: 'rising',
  [PostSortOrder.CONTROVERSIAL]: 'controversial',
};

/** Reddit "top"/"controversial" time window → its `?t=` query value. */
export const TIME_RANGE_MAP: Record<TopTimeRange, string> = {
  [TopTimeRange.HOUR]: 'hour',
  [TopTimeRange.DAY]: 'day',
  [TopTimeRange.WEEK]: 'week',
  [TopTimeRange.MONTH]: 'month',
  [TopTimeRange.YEAR]: 'year',
  [TopTimeRange.ALL]: 'all',
};

/**
 * Builds a sorted Reddit listing URL (e.g. `.../r/AskReddit/top/?t=week`).
 * Used by scrapers that only accept a URL to visit rather than separate
 * sort/time parameters (e.g. Apify's `startUrls`).
 */
export function buildSubredditListingUrl(
  community: string,
  sort: PostSortOrder,
  topTimeRange?: TopTimeRange,
): string {
  const sortSegment = SORT_MAP[sort] ?? 'hot';
  const base = `https://www.reddit.com/r/${encodeURIComponent(community)}/${sortSegment}/`;

  if (sort === PostSortOrder.TOP || sort === PostSortOrder.CONTROVERSIAL) {
    const t = topTimeRange ? TIME_RANGE_MAP[topTimeRange] : 'all';
    return `${base}?t=${t}`;
  }

  return base;
}

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
      sourceType: SourceType.THREAD,
      community: postMatch[1],
      externalPostId: postMatch[2],
    };
  }

  const communityMatch = normalized.match(COMMUNITY_URL_REGEX);
  if (communityMatch) {
    return {
      sourceType: SourceType.COMMUNITY,
      community: communityMatch[1],
    };
  }

  throw new BadRequestException(
    'URL must be a subreddit URL (e.g. https://www.reddit.com/r/startups) or a post URL (e.g. https://www.reddit.com/r/startups/comments/xxxxx/example_post)',
  );
}
