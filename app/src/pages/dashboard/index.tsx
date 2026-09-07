import { useMemo, type FC } from "react";
import { useGetResearchProjects } from "@/features/research-projects/hooks/use-research-projects";
import { useGetSavedInsights } from "@/features/saved-insights/hooks/use-saved-insights";
import { useGetKnowledgeInsights } from "@/features/knowledge-insights/hooks/use-knowledge-insights";
import { useGetConversations } from "@/features/conversations/hooks/use-conversations";
import { KnowledgeInsightOrderByFields, KnowledgeInsightOrderDirections } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { HeroPanel } from "./components/hero-panel";
import { RecentProjectsCard } from "./components/recent-projects-card";
import { LatestInsightsCard } from "./components/latest-insights-card";
import { ThisMonthCard, AskAssistantCard, EvidenceQualityCard } from "./components/side-column";
import { getCompletedProjects, isSameMonth, sumBy } from "./utils/aggregate";
import type { MiniBarChartDatum } from "@/components/ui/mini-bar-chart";

const INSIGHT_SLOTS = 3;
const INSIGHTS_PER_PROJECT = 2;

const DashboardPage: FC = () => {
  const projects = useGetResearchProjects({ limit: 100, order_by: "updated_at", order_direction: "desc" });
  const savedInsights = useGetSavedInsights({ limit: 1 });

  const allProjects = projects.data?.data ?? [];
  const completedTop = getCompletedProjects(allProjects).slice(0, INSIGHT_SLOTS);
  const slotIds = Array.from({ length: INSIGHT_SLOTS }, (_, i) => completedTop[i]?.id ?? "");

  // Fixed-slot hook calls (rules-of-hooks safe): no cross-project "latest insights"
  // endpoint exists, so we sample the 3 most recently completed projects.
  const insightsSlot0 = useGetKnowledgeInsights(slotIds[0], {
    limit: INSIGHTS_PER_PROJECT,
    order_by: KnowledgeInsightOrderByFields.CREATED_AT,
    order_direction: KnowledgeInsightOrderDirections.DESC,
  });
  const insightsSlot1 = useGetKnowledgeInsights(slotIds[1], {
    limit: INSIGHTS_PER_PROJECT,
    order_by: KnowledgeInsightOrderByFields.CREATED_AT,
    order_direction: KnowledgeInsightOrderDirections.DESC,
  });
  const insightsSlot2 = useGetKnowledgeInsights(slotIds[2], {
    limit: INSIGHTS_PER_PROJECT,
    order_by: KnowledgeInsightOrderByFields.CREATED_AT,
    order_direction: KnowledgeInsightOrderDirections.DESC,
  });

  const conversationsSlot0 = useGetConversations(slotIds[0], { limit: 1 });
  const conversationsSlot1 = useGetConversations(slotIds[1], { limit: 1 });
  const conversationsSlot2 = useGetConversations(slotIds[2], { limit: 1 });

  const insightSlots = [insightsSlot0, insightsSlot1, insightsSlot2];
  const conversationSlots = [conversationsSlot0, conversationsSlot1, conversationsSlot2];
  const insightsLoading = insightSlots.some((slot, i) => slotIds[i] && slot.isLoading);

  const mergedInsights = useMemo(() => {
    const merged = insightSlots.flatMap((slot, i) =>
      (slot.data?.data ?? []).map((insight) => ({ insight, community: completedTop[i]?.name })),
    );
    return merged
      .sort((a, b) => new Date(b.insight.created_at).getTime() - new Date(a.insight.created_at).getTime())
      .slice(0, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insightsSlot0.data, insightsSlot1.data, insightsSlot2.data]);

  const sampledInsightsFlat = insightSlots.flatMap((slot) => slot.data?.data ?? []);
  const sourcesPerInsight = sampledInsightsFlat.length
    ? sampledInsightsFlat.reduce((total, insight) => total + insight.citations.length, 0) / sampledInsightsFlat.length
    : null;
  const evidenceQualityPct = sampledInsightsFlat.length
    ? (sampledInsightsFlat.filter((insight) => insight.citations.length >= 3).length / sampledInsightsFlat.length) * 100
    : null;

  const assistantQuestions = conversationSlots.reduce((total, slot) => total + (slot.data?.pagination.total ?? 0), 0);

  const now = new Date();
  const projectsThisMonth = allProjects.filter((project) => isSameMonth(project.created_at, now));
  const commentsIndexed = sumBy(allProjects, (project) => project.comments_analyzed);
  const commentsProcessedThisMonth = sumBy(projectsThisMonth, (project) => project.comments_analyzed);

  const chartData: MiniBarChartDatum[] = allProjects
    .slice(0, 7)
    .reverse()
    .map((project) => ({ label: project.name, value: project.comments_analyzed }));

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <HeroPanel
        commentsIndexed={commentsIndexed}
        insightsKept={savedInsights.data?.pagination.total ?? 0}
        sourcesPerInsight={sourcesPerInsight}
        projectsCount={projects.data?.pagination.total ?? 0}
        isLoading={projects.isLoading}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <RecentProjectsCard projects={allProjects.slice(0, 4)} isLoading={projects.isLoading} />
          <LatestInsightsCard insights={mergedInsights} isLoading={insightsLoading} />
        </div>

        <div className="space-y-5">
          <ThisMonthCard
            analysesRun={projectsThisMonth.length}
            commentsProcessed={commentsProcessedThisMonth}
            assistantQuestions={assistantQuestions}
            chartData={chartData}
            isLoading={projects.isLoading}
          />
          <AskAssistantCard />
          <EvidenceQualityCard qualityPct={evidenceQualityPct} isLoading={insightsLoading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
