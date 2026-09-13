/**
 * Field-normalization helpers shared by every Reddit data-source adapter
 * (Bright Data, Apify, …). Each adapter maps a different raw record shape
 * onto the same `RawRedditPost`/`RawRedditComment` contract, so the actual
 * normalization rules (what counts as "deleted", how to coerce a score) stay
 * here instead of being copy-pasted per adapter.
 */

export function pick(record: Record<string, any>, keys: string[]): any {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
      return record[key];
    }
  }
  return undefined;
}

export function nullIfDeleted(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null;
  if (value === '[deleted]' || value === '[removed]') return null;
  return value;
}

export function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function toNullableNumber(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function previewText(text: string | undefined | null): string | undefined {
  if (!text) return undefined;
  return text.length > 280 ? `${text.slice(0, 280)}…` : text;
}
