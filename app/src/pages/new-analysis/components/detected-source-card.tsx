import type { FC } from "react";
import { Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseRedditUrl } from "../utils/reddit-url.utils";
import { SourceType, type DetectSourceResponse } from "@/features/research-projects/interfaces/research-projects.interfaces";

interface DetectedSourceCardProps {
  url: string;
  result?: DetectSourceResponse;
  isPending: boolean;
  onDetect: () => void;
}

/**
 * Detection calls the real Apify-backed `detect-source` endpoint — a billed
 * request — so it must only ever fire from the explicit button below, never
 * automatically while the user is typing or pasting a URL.
 */
export const DetectedSourceCard: FC<DetectedSourceCardProps> = ({ url, result, isPending, onDetect }) => {
  const { community } = parseRedditUrl(url);
  if (!community) return null;

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" loading={isPending} onClick={onDetect}>
          <Sparkles className="h-3.5 w-3.5" />
          Detect source
        </Button>
        {!result && !isPending && (
          <span className="font-mono text-[11px] text-muted-foreground">
            Uses one Apify request to preview r/{community} before you configure filters.
          </span>
        )}
      </div>

      {result && !result.is_public && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="text-sm font-semibold text-destructive">Could not read this source</div>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {result.error ?? "This subreddit or post is private, quarantined, or unavailable."}
          </p>
        </div>
      )}

      {result && result.is_public && (
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-flame font-mono text-[11px] font-semibold text-white">r/</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{result.title || `r/${result.community}`}</div>
              <div className="font-mono text-[11px] text-muted-foreground">
                {[
                  result.source_type === SourceType.THREAD ? "Thread detected" : "Subreddit detected",
                  typeof result.post_count === "number" && `${result.post_count} post${result.post_count === 1 ? "" : "s"}`,
                  typeof result.comment_count === "number" && `${result.comment_count} comments`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
            <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              <Globe className="h-3 w-3" /> Public
            </span>
          </div>
          {result.body_preview && <p className="mt-3 line-clamp-2 text-[13px] text-muted-foreground">{result.body_preview}</p>}
          {!!result.flairs?.length && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {result.flairs.map((flair) => (
                <span key={flair} className="rounded-full bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {flair}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
