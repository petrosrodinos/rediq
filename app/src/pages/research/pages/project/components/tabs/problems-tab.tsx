import type { FC } from "react";
import { AlertTriangle, OctagonAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CitationChip } from "@/components/ui/citation-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { InsightType, type KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { byType, getProblemSeverity } from "../../utils/insight-grouping.utils";

interface ProblemsTabProps {
  insights: KnowledgeInsight[];
}

export const ProblemsTab: FC<ProblemsTabProps> = ({ insights }) => {
  const problems = byType(insights, InsightType.PROBLEM).sort((a, b) => b.supporting_count - a.supporting_count);

  if (!problems.length) {
    return <EmptyState icon={<OctagonAlert className="h-5 w-5" />} title="No problems surfaced yet" />;
  }

  return (
    <div className="space-y-3">
      {problems.map((insight) => {
        const severity = getProblemSeverity(insight);
        return (
          <article key={insight.id} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${severity === "high" ? "bg-rose-soft text-rose" : "bg-amber-soft text-amber"}`}>
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm font-semibold">{insight.title}</p>
              <p className="text-sm text-muted-foreground">{insight.content}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {insight.citations.map((citation) => (
                  <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
                ))}
                <Badge variant="outline">{insight.supporting_count} mentions</Badge>
                <Badge variant="outline" className={severity === "high" ? "border-rose/25 bg-rose-soft text-rose" : "border-amber/25 bg-amber-soft text-amber"}>
                  severity {severity}
                </Badge>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
