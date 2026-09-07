import type { FC } from "react";
import { HelpCircle } from "lucide-react";
import { CitationChip } from "@/components/ui/citation-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { InsightType, type KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { byType } from "../../utils/insight-grouping.utils";

interface FaqTabProps {
  insights: KnowledgeInsight[];
}

export const FaqTab: FC<FaqTabProps> = ({ insights }) => {
  const faqs = byType(insights, InsightType.FAQ);

  if (!faqs.length) {
    return <EmptyState icon={<HelpCircle className="h-5 w-5" />} title="No frequently asked questions yet" />;
  }

  return (
    <div className="space-y-3">
      {faqs.map((insight) => (
        <article key={insight.id} className="space-y-2 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">{insight.title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{insight.content}</p>
          <div className="flex flex-wrap gap-1.5">
            {insight.citations.map((citation) => (
              <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
};
