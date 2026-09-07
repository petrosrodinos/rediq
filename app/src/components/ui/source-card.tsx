import type { FC } from "react";
import { ExternalLink, Eye, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCitationDrawer, type CitationPostLike, type CitationCommentLike } from "@/components/providers/citation-drawer-provider";
import { formatRelativeTime } from "@/lib/date";
import { formatCompactNumber } from "@/lib/format-number";

interface SourceCardProps {
  kind: "post" | "comment";
  id: string;
  community: string;
  author?: string | null;
  score: number;
  postedAt: string;
  permalink: string;
  title?: string | null;
  excerpt: string;
  topics?: string[];
  matchPct?: number;
  preloadedPost?: CitationPostLike | null;
  preloadedComment?: CitationCommentLike | null;
  className?: string;
}

const REDDIT_BASE_URL = "https://reddit.com";

export const SourceCard: FC<SourceCardProps> = ({
  kind,
  id,
  community,
  author,
  score,
  postedAt,
  permalink,
  title,
  excerpt,
  topics,
  matchPct,
  preloadedPost,
  preloadedComment,
  className,
}) => {
  const drawer = useCitationDrawer();
  const initials = (author ?? "u").slice(0, 2).toUpperCase();

  return (
    <article className={cn("rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-foreground/15", className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-semibold text-accent-foreground">
          {initials}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">u/{author ?? "unknown"}</span>
            <span>·</span>
            <span>r/{community}</span>
            <span>·</span>
            <span>{formatRelativeTime(postedAt)}</span>
            <Badge variant="outline" className="ml-auto gap-1 font-mono text-flame">
              <ArrowBigUp className="h-3 w-3" />
              {formatCompactNumber(score)}
            </Badge>
          </div>

          {title ? <p className="text-sm font-semibold leading-snug">{title}</p> : null}

          <p className="relative border-l-2 border-primary/60 pl-3 text-sm leading-relaxed text-foreground/90 line-clamp-3">{excerpt}</p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge variant="secondary" className="capitalize">
              {kind}
            </Badge>
            {topics?.slice(0, 2).map((topic) => (
              <Badge key={topic} variant="outline">
                {topic}
              </Badge>
            ))}
            {typeof matchPct === "number" ? <Badge variant="outline">{matchPct}% match</Badge> : null}

            <div className="ml-auto flex items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  drawer.open(
                    kind === "post"
                      ? { postUuid: id, post: preloadedPost, excerpt }
                      : { commentUuid: id, comment: preloadedComment, excerpt },
                  )
                }
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </Button>
              <Button type="button" variant="ghost" size="sm" asChild>
                <a href={`${REDDIT_BASE_URL}${permalink}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on Reddit
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
