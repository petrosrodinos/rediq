import type { FC } from "react";
import { CitationChip } from "@/components/ui/citation-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Tags } from "lucide-react";
import type { TopicListItem } from "@/features/topics/interfaces/topics.interfaces";
import type { KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";

interface TopicsTabProps {
  topics: TopicListItem[];
  insights: KnowledgeInsight[];
}

export const TopicsTab: FC<TopicsTabProps> = ({ topics, insights }) => {
  if (!topics.length) {
    return <EmptyState icon={<Tags className="h-5 w-5" />} title="No topics yet" description="Topics are grouped automatically once enough insights are extracted." />;
  }

  const maxCount = Math.max(...topics.map((topic) => topic._count.knowledge_insights), 1);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => {
        const topInsight = insights.find((insight) => insight.topic_uuid === topic.id);
        const citation = topInsight?.citations[0];

        return (
          <article key={topic.id} className="space-y-2 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">{topic.name}</p>
              <span className="font-mono text-xs text-muted-foreground">{topic._count.knowledge_insights} insights</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-foreground" style={{ width: `${(topic._count.knowledge_insights / maxCount) * 100}%` }} />
            </div>
            <p className="text-sm text-muted-foreground">{topic.summary ?? "No summary yet."}</p>
            {citation ? (
              <CitationChip postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
            ) : null}
          </article>
        );
      })}
    </div>
  );
};
