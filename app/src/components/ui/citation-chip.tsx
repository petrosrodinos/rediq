import type { FC } from "react";
import { cn } from "@/lib/utils";
import { useCitationDrawer, type CitationSource } from "@/components/providers/citation-drawer-provider";
import { formatScoreLabel } from "@/lib/format-number";

interface CitationChipProps extends CitationSource {
  index?: number;
  score?: number | null;
  className?: string;
}

export const CitationChip: FC<CitationChipProps> = ({ index, score, className, ...source }) => {
  const drawer = useCitationDrawer();
  const kind = source.commentUuid ? "Reddit comment" : "Reddit post";

  return (
    <button
      type="button"
      onClick={() => drawer.open(source)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] font-medium text-foreground/80 shadow-sm transition-colors hover:border-flame/40 hover:bg-flame-soft hover:text-foreground",
        className,
      )}
    >
      {typeof index === "number" ? <b className="font-mono text-flame">{index}</b> : null}
      {kind}
      {typeof score === "number" ? <span className="text-muted-foreground">· {formatScoreLabel(score)}</span> : null}
    </button>
  );
};
