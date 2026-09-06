interface Rankable {
  score: number;
  posted_at: Date;
  num_comments?: number;
}

interface RankingWeights {
  prioritize_recent: boolean;
  prioritize_engagement: boolean;
  prioritize_popular: boolean;
}

/**
 * Cheap heuristic ranking used to pick which posts/comments are worth spending
 * AI extraction budget on. Not a substitute for real semantic relevance ranking,
 * but keeps the pipeline from just taking "the first N" as the spec requires.
 */
export function rankByValue<T extends Rankable>(
  items: T[],
  weights: RankingWeights,
): T[] {
  const now = Date.now();

  const scored = items.map((item) => {
    let value = Math.log10(Math.max(item.score, 0) + 1);

    if (weights.prioritize_popular) {
      value += Math.log10(Math.max(item.score, 0) + 1) * 0.5;
    }

    if (
      weights.prioritize_engagement &&
      typeof item.num_comments === 'number'
    ) {
      value += Math.log10(item.num_comments + 1) * 0.5;
    }

    if (weights.prioritize_recent) {
      const ageDays = Math.max(
        (now - item.posted_at.getTime()) / 86_400_000,
        0,
      );
      value += Math.max(2 - Math.log10(ageDays + 1), 0);
    }

    return { item, value };
  });

  return scored.sort((a, b) => b.value - a.value).map((s) => s.item);
}

export function normalizeForDedup(text: string | null): string {
  if (!text) return '';
  return text.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 500);
}

export function deduplicateByContent<T>(
  items: T[],
  getContent: (item: T) => string | null,
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const normalized = normalizeForDedup(getContent(item));
    if (!normalized) {
      result.push(item);
      continue;
    }
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(item);
  }

  return result;
}

export function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
