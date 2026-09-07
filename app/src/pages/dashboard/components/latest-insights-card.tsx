import type { FC } from "react";
import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CitationChip } from "@/components/ui/citation-chip";
import type { KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { Routes } from "@/routes/routes";

interface LatestInsightsCardProps {
  insights: { insight: KnowledgeInsight; community?: string }[];
  isLoading: boolean;
}

export const LatestInsightsCard: FC<LatestInsightsCardProps> = ({ insights, isLoading }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border py-3.5">
        <CardTitle className="text-[15px]">Latest insights</CardTitle>
        <Button variant="link" size="sm" className="h-auto p-0 text-flame" asChild>
          <Link to={Routes.dashboard.saved}>Saved insights</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
        ) : !insights.length ? (
          <EmptyState
            className="border-0"
            icon={<Lightbulb className="h-5 w-5" />}
            title="No insights extracted yet"
            description="Insights appear here once an analysis finishes."
          />
        ) : (
          insights.map(({ insight, community }) => (
            <article key={insight.id} className="rounded-2xl border border-border p-4 transition-colors hover:border-foreground/20">
              <p className="text-[14.5px] leading-[1.7]">{insight.content}</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {insight.citations.slice(0, 2).map((citation, index) => (
                  <CitationChip
                    key={citation.id}
                    index={index + 1}
                    postUuid={citation.post_uuid}
                    commentUuid={citation.comment_uuid}
                    excerpt={citation.excerpt}
                    post={citation.post}
                    comment={citation.comment}
                  />
                ))}
                {community ? <Badge variant="secondary">r/{community}</Badge> : null}
              </div>
            </article>
          ))
        )}
      </CardContent>
    </Card>
  );
};
