import type { FC } from "react";
import { Sparkles } from "lucide-react";
import { parseRedditUrl } from "../utils/reddit-url.utils";

interface DetectedSourceCardProps {
  url: string;
}

export const DetectedSourceCard: FC<DetectedSourceCardProps> = ({ url }) => {
  const { community, isThread } = parseRedditUrl(url);

  if (!community) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-flame font-mono text-[11px] font-semibold text-white">r/</span>
      <div className="min-w-0">
        <div className="text-sm font-semibold">r/{community}</div>
        <div className="font-mono text-[11px] text-muted-foreground">
          {isThread ? "Specific thread detected" : "Subreddit detected"} · Threadline will confirm post &amp; comment counts once collection starts
        </div>
      </div>
      <Sparkles className="ml-auto h-4 w-4 shrink-0 text-flame" />
    </div>
  );
};
