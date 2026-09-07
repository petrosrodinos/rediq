import type { FC } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CitationChip } from "@/components/ui/citation-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { MiniBarChart } from "@/components/ui/mini-bar-chart";
import { InsightType, type KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import type { Post } from "@/features/posts/interfaces/posts.interfaces";
import { byType } from "../../utils/insight-grouping.utils";
import { getMonthlyPostVolume, getScoreDistribution, getTopContributors } from "../../utils/posts-aggregates.utils";

interface StatisticsTabProps {
  insights: KnowledgeInsight[];
  posts: Post[];
}

export const StatisticsTab: FC<StatisticsTabProps> = ({ insights, posts }) => {
  const statistics = byType(insights, InsightType.STATISTIC);
  const monthly = getMonthlyPostVolume(posts);
  const scoreBuckets = getScoreDistribution(posts);
  const contributors = getTopContributors(posts);
  const peakMonthIndex = monthly.reduce((peakIndex, month, index) => (month.value > monthly[peakIndex].value ? index : peakIndex), 0);

  return (
    <div className="space-y-5">
      {statistics.length ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Numbers mentioned in the threads</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {statistics.map((insight) => (
              <div key={insight.id} className="space-y-1.5 rounded-xl border border-border p-3">
                <p className="font-display text-2xl font-semibold">{insight.title}</p>
                <p className="text-xs text-muted-foreground">{insight.content}</p>
                <p className="font-mono text-[11px] text-muted-foreground">reported by {insight.supporting_count} commenters</p>
                <div className="flex flex-wrap gap-1">
                  {insight.citations.slice(0, 1).map((citation) => (
                    <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <EmptyState icon={<BarChart3 className="h-5 w-5" />} title="No standout statistics extracted yet" />
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Posts by month</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniBarChart data={monthly} className="h-[90px]" highlightIndex={peakMonthIndex} />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
              {monthly.map((month) => (
                <span key={month.label}>{month.label}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Score distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scoreBuckets.map((bucket) => (
              <div key={bucket.label} className="flex items-center gap-2 text-xs">
                <span className="w-16 shrink-0 font-mono text-muted-foreground">{bucket.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-foreground" style={{ width: `${(bucket.count / Math.max(...scoreBuckets.map((b) => b.count), 1)) * 100}%` }} />
                </div>
                <span className="font-mono">{bucket.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top contributors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {contributors.length ? (
            contributors.map((contributor) => (
              <div key={contributor.author} className="flex justify-between text-sm">
                <span>u/{contributor.author}</span>
                <span className="font-mono text-muted-foreground">{contributor.count} posts</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No contributor data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
