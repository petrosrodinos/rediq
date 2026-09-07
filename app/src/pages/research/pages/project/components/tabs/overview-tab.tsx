import { useMemo, type FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CitationChip } from "@/components/ui/citation-chip";
import { StatTile } from "@/components/ui/stat-tile";
import type { KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { InsightType } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import type { TopicListItem } from "@/features/topics/interfaces/topics.interfaces";
import type { Post } from "@/features/posts/interfaces/posts.interfaces";
import type { ResearchProject } from "@/features/research-projects/interfaces/research-projects.interfaces";
import type { AnalysisConfiguration } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";
import type { AnalysisJob } from "@/features/analysis-jobs/interfaces/analysis-jobs.interfaces";
import { getProcessingModeLabel } from "@/config/constants/dropdowns/research-projects/processing-mode-form.options";
import { formatCurrency } from "@/lib/format-number";
import { formatDate } from "@/lib/date";
import { getTopFlairs, getUniqueAuthorCount, getMedianScore, getDateRange } from "../../utils/posts-aggregates.utils";
import { byType } from "../../utils/insight-grouping.utils";

interface OverviewTabProps {
  project: ResearchProject;
  insights: KnowledgeInsight[];
  topics: TopicListItem[];
  posts: Post[];
  job?: AnalysisJob | null;
  configuration?: AnalysisConfiguration | null;
}

export const OverviewTab: FC<OverviewTabProps> = ({ project, insights, topics, posts, job, configuration }) => {
  const narrative = useMemo(() => {
    const pool = insights.filter((insight) => insight.type === InsightType.KEY_INSIGHT || insight.type === InsightType.TREND);
    return pool.length ? pool : insights;
  }, [insights]).slice(0, 4);

  const topProblem = byType(insights, InsightType.PROBLEM).sort((a, b) => b.supporting_count - a.supporting_count)[0];
  const topRecommendation = [...byType(insights, InsightType.RECOMMENDATION), ...byType(insights, InsightType.PRODUCT_MENTION)].sort(
    (a, b) => b.supporting_count - a.supporting_count,
  )[0];
  const topTopic = [...topics].sort((a, b) => b._count.knowledge_insights - a._count.knowledge_insights)[0];
  const topContradiction = byType(insights, InsightType.CONTRADICTION)[0];

  const flairs = getTopFlairs(posts);
  const maxFlairCount = Math.max(...flairs.map((f) => f.count), 1);
  const uniqueAuthors = getUniqueAuthorCount(posts);
  const medianScore = getMedianScore(posts);
  const dateRange = getDateRange(posts);

  const totalTokens = (job?.prompt_tokens ?? 0) + (job?.completion_tokens ?? 0);
  const cost = job?.actual_cost_usd ?? job?.estimated_cost_usd;

  const sentiment = {
    positive: project.sentiment_positive_pct ?? 0,
    neutral: project.sentiment_neutral_pct ?? 0,
    negative: project.sentiment_negative_pct ?? 0,
  };
  const sentimentGradient = `conic-gradient(#0F8A62 0% ${sentiment.positive}%, #A8A69F ${sentiment.positive}% ${sentiment.positive + sentiment.neutral}%, #E5484D ${sentiment.positive + sentiment.neutral}% 100%)`;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">What the threads say</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {narrative.length ? (
              narrative.map((insight) => (
                <div key={insight.id} className="space-y-2">
                  <p className="text-sm leading-[1.7]">{insight.content}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {insight.citations.map((citation) => (
                      <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No insights extracted yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Signals worth acting on</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <StatTile label="Most repeated complaint" value={topProblem?.title ?? "—"} detail={topProblem ? `${topProblem.supporting_count} mentions` : undefined} />
            <StatTile label="Most recommended" value={topRecommendation?.title ?? "—"} detail={topRecommendation ? `${topRecommendation.supporting_count} mentions` : undefined} />
            <StatTile label="Most discussed topic" value={topTopic?.name ?? "—"} detail={topTopic ? `${topTopic._count.knowledge_insights} insights` : undefined} />
            <StatTile label="Open question" value={topContradiction?.title ?? "None found"} detail={topContradiction ? `${topContradiction.supporting_count} mentions` : undefined} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Posts</span><span className="font-medium">{project.posts_analyzed.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Comments</span><span className="font-medium">{project.comments_analyzed.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Unique post authors</span><span className="font-medium">{uniqueAuthors || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date range</span><span className="font-medium">{dateRange ? `${formatDate(dateRange.from)} – ${formatDate(dateRange.to)}` : "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Median post score</span><span className="font-medium">{medianScore ?? "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Processing mode</span><span className="font-medium">{configuration ? getProcessingModeLabel(configuration.processing_mode) : "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">AI cost</span><span className="font-medium">{typeof cost === "number" ? formatCurrency(cost) : "—"}{totalTokens ? ` · ${totalTokens.toLocaleString()} tokens` : ""}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top flairs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {flairs.length ? (
              flairs.map((flair) => (
                <div key={flair.flair} className="space-y-1">
                  <div className="flex justify-between text-xs"><span>{flair.flair}</span><span className="font-mono text-muted-foreground">{flair.count}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-foreground" style={{ width: `${(flair.count / maxFlairCount) * 100}%` }} /></div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No flair data available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full" style={{ background: sentimentGradient }} />
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-moss" />Positive <Badge variant="outline" className="ml-auto">{sentiment.positive.toFixed(0)}%</Badge></div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground/50" />Neutral <Badge variant="outline" className="ml-auto">{sentiment.neutral.toFixed(0)}%</Badge></div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose" />Negative <Badge variant="outline" className="ml-auto">{sentiment.negative.toFixed(0)}%</Badge></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
