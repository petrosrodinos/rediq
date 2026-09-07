import type { FC, ReactNode } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CitationChip } from "@/components/ui/citation-chip";
import type { KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";

interface InsightCardProps {
  insight: KnowledgeInsight;
  typeLabel: string;
  badgeClassName?: string;
  footer?: ReactNode;
  onSave?: () => void;
  isSaving?: boolean;
  className?: string;
}

export const InsightCard: FC<InsightCardProps> = ({ insight, typeLabel, badgeClassName, footer, onSave, isSaving, className }) => {
  return (
    <article className={cn("flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <Badge variant="outline" className={badgeClassName}>
          {typeLabel}
        </Badge>
        {onSave ? (
          <Button variant="ghost" size="sm" onClick={onSave} loading={isSaving}>
            <Bookmark className="h-3.5 w-3.5" />
            Save
          </Button>
        ) : null}
      </div>
      <p className="text-sm font-semibold leading-snug">{insight.title}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{insight.content}</p>
      <div className="flex flex-wrap gap-1.5">
        {insight.citations.map((citation) => (
          <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
        ))}
      </div>
      {footer ? <p className="font-mono text-[11px] text-muted-foreground">{footer}</p> : null}
    </article>
  );
};
