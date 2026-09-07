import type { FC } from "react";
import { FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SourceCard } from "@/components/ui/source-card";
import type { CitationCommentLike, CitationPostLike } from "@/components/providers/citation-drawer-provider";
import { SemanticResultTypes, type SemanticSearchResult } from "@/features/search/interfaces/search.interfaces";
import { formatCompactNumber } from "@/lib/format-number";

interface SearchResultCardProps {
  result: SemanticSearchResult;
  projectName?: string;
}

/**
 * `source` is untyped on the API (`SemanticSearchResult.source: unknown`) — every field read
 * off it here is defensive on purpose, not a shortcut.
 */
export const SearchResultCard: FC<SearchResultCardProps> = ({ result, projectName }) => {
  const source = (result.source ?? {}) as Record<string, unknown>;
  const asString = (value: unknown): string | undefined => (typeof value === "string" ? value : undefined);

  if (result.type === SemanticResultTypes.POST || result.type === SemanticResultTypes.COMMENT) {
    return (
      <SourceCard
        kind={result.type}
        id={result.id}
        community={asString(source.community) ?? "unknown"}
        author={asString(source.author) ?? null}
        score={typeof source.score === "number" ? source.score : 0}
        postedAt={asString(source.posted_at) ?? new Date().toISOString()}
        permalink={asString(source.permalink) ?? ""}
        title={asString(source.title) ?? null}
        excerpt={result.excerpt || asString(source.body) || "No excerpt available."}
        matchPct={Math.round(result.score * 100)}
        preloadedPost={result.type === SemanticResultTypes.POST ? (source as unknown as CitationPostLike) : undefined}
        preloadedComment={result.type === SemanticResultTypes.COMMENT ? (source as unknown as CitationCommentLike) : undefined}
      />
    );
  }

  if (result.type === SemanticResultTypes.KNOWLEDGE_INSIGHT) {
    return (
      <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <Badge variant="secondary">Insight</Badge>
              {projectName ? <span>{projectName}</span> : null}
              <Badge variant="outline" className="ml-auto">
                {Math.round(result.score * 100)}% match
              </Badge>
            </div>
            {asString(source.title) ? <p className="text-sm font-semibold leading-snug">{asString(source.title)}</p> : null}
            <p className="text-sm leading-relaxed text-foreground/90 line-clamp-3">{result.excerpt || asString(source.content)}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="secondary">Excerpt</Badge>
            {projectName ? <span>{projectName}</span> : null}
            <Badge variant="outline" className="ml-auto">
              {formatCompactNumber(Math.round(result.score * 100))}% match
            </Badge>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90 line-clamp-4">{result.excerpt || asString(source.content)}</p>
        </div>
      </div>
    </article>
  );
};
