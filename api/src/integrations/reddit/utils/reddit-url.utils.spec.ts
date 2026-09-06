import { BadRequestException } from '@nestjs/common';
import { SourceType } from 'generated/prisma';
import { parseRedditUrl } from './reddit-url.utils';

describe('parseRedditUrl', () => {
  it('parses a subreddit URL', () => {
    expect(parseRedditUrl('https://www.reddit.com/r/startups/')).toEqual({
      sourceType: SourceType.COMMUNITY,
      community: 'startups',
    });
  });

  it('parses a subreddit URL without a trailing slash', () => {
    expect(parseRedditUrl('https://reddit.com/r/SaaS')).toEqual({
      sourceType: SourceType.COMMUNITY,
      community: 'SaaS',
    });
  });

  it('parses a specific post URL', () => {
    expect(
      parseRedditUrl(
        'https://www.reddit.com/r/startups/comments/abc123/example_post/',
      ),
    ).toEqual({
      sourceType: SourceType.THREAD,
      community: 'startups',
      externalPostId: 'abc123',
    });
  });

  it('parses a post URL without a trailing slug', () => {
    expect(
      parseRedditUrl('https://www.reddit.com/r/startups/comments/abc123'),
    ).toEqual({
      sourceType: SourceType.THREAD,
      community: 'startups',
      externalPostId: 'abc123',
    });
  });

  it('rejects non-reddit URLs', () => {
    expect(() => parseRedditUrl('https://www.example.com/r/startups')).toThrow(
      BadRequestException,
    );
  });

  it('rejects malformed URLs', () => {
    expect(() => parseRedditUrl('not-a-url')).toThrow(BadRequestException);
  });

  it('rejects reddit URLs that are neither a community nor a post', () => {
    expect(() => parseRedditUrl('https://www.reddit.com/user/someone')).toThrow(
      BadRequestException,
    );
  });
});
