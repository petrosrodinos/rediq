import type { FC } from "react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CitationChip } from "@/components/ui/citation-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { InsightType, SentimentLabel, type KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { byType } from "../../utils/insight-grouping.utils";

interface SolutionsTabProps {
  insights: KnowledgeInsight[];
}

export const SolutionsTab: FC<SolutionsTabProps> = ({ insights }) => {
  const solutions = byType(insights, InsightType.SOLUTION).sort((a, b) => b.supporting_count - a.supporting_count);

  if (!solutions.length) {
    return <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title="No solutions surfaced yet" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {solutions.map((insight) => {
        const worksForMost = insight.sentiment === SentimentLabel.POSITIVE;
        return (
          <article key={insight.id} className="space-y-2 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
              <p className="text-sm font-semibold">{insight.title}</p>
            </div>
            <p className="text-sm text-muted-foreground">{insight.content}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {insight.citations.map((citation) => (
                <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
              ))}
              <Badge variant="outline" className={worksForMost ? "border-moss/30 bg-moss-soft text-moss" : "border-amber/30 bg-amber-soft text-amber"}>
                {worksForMost ? `works for ${insight.supporting_count} people` : "mixed results"}
              </Badge>
            </div>
          </article>
        );
      })}
    </div>
  );
};
