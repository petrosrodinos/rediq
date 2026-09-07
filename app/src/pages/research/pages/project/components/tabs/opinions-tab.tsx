import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CitationChip } from "@/components/ui/citation-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { MessagesSquare } from "lucide-react";
import { InsightType, type KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { byType, byTypes } from "../../utils/insight-grouping.utils";

interface OpinionsTabProps {
  insights: KnowledgeInsight[];
}

export const OpinionsTab: FC<OpinionsTabProps> = ({ insights }) => {
  const agreements = byTypes(insights, [InsightType.CONSENSUS, InsightType.OPINION]);
  const splits = byType(insights, InsightType.CONTRADICTION);

  if (!agreements.length && !splits.length) {
    return <EmptyState icon={<MessagesSquare className="h-5 w-5" />} title="No opinions surfaced yet" />;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Where the thread agrees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {agreements.length ? (
            agreements.map((insight) => (
              <div key={insight.id} className="space-y-1.5 border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm">{insight.content}</p>
                <div className="flex flex-wrap gap-1.5">
                  {insight.citations.map((citation) => (
                    <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nothing clearly agreed upon yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Where the thread splits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {splits.length ? (
            splits.map((insight) => (
              <div key={insight.id} className="space-y-1.5 border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="text-sm text-muted-foreground">{insight.content}</p>
                <div className="flex flex-wrap gap-1.5">
                  {insight.citations.map((citation) => (
                    <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No notable disagreement found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
