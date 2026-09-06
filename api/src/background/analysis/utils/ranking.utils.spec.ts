import { chunkArray, deduplicateByContent, rankByValue } from './ranking.utils';

describe('deduplicateByContent', () => {
  it('removes items with equivalent normalized content', () => {
    const items = [
      { id: 1, body: 'Great product!' },
      { id: 2, body: '  great   product!  ' },
      { id: 3, body: 'Something else entirely' },
    ];

    const result = deduplicateByContent(items, (item) => item.body);

    expect(result.map((i) => i.id)).toEqual([1, 3]);
  });

  it('keeps items with no content instead of collapsing them together', () => {
    const items = [
      { id: 1, body: null },
      { id: 2, body: null },
    ];

    const result = deduplicateByContent(items, (item) => item.body);

    expect(result).toHaveLength(2);
  });
});

describe('rankByValue', () => {
  it('ranks higher-scored items first when no weighting is applied', () => {
    const items = [
      { score: 5, posted_at: new Date() },
      { score: 500, posted_at: new Date() },
      { score: 50, posted_at: new Date() },
    ];

    const ranked = rankByValue(items, {
      prioritize_recent: false,
      prioritize_engagement: false,
      prioritize_popular: false,
    });

    expect(ranked.map((i) => i.score)).toEqual([500, 50, 5]);
  });
});

describe('chunkArray', () => {
  it('splits an array into chunks of the given size', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns an empty array for an empty input', () => {
    expect(chunkArray([], 3)).toEqual([]);
  });
});
