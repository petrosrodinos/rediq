import type { FC } from "react";
import { InsightCard } from "../insight-card";
import { InsightType, type KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { getInsightTypeLabel } from "@/config/constants/dropdowns/knowledge-insights/insight-type-form.options";
import { KEY_INSIGHT_TYPES, getConfidenceLevel } from "../../utils/insight-grouping.utils";
import { byTypes } from "../../utils/insight-grouping.utils";
import { useSaveInsight } from "../../hooks/use-save-insight";
import { EmptyState } from "@/components/ui/empty-state";
import { Lightbulb } from "lucide-react";

const badgeClassByType: Record<string, string> = {
  [InsightType.KEY_INSIGHT]: "border-flame/30 bg-flame-soft text-flame-deep",
  [InsightType.RECOMMENDATION]: "border-moss/30 bg-moss-soft text-moss",
  [InsightType.TREND]: "border-sea/30 bg-sea-soft text-sea",
  [InsightType.ARGUMENT]: "border-amber/30 bg-amber-soft text-amber",
  [InsightType.USER_EXPERIENCE]: "border-border bg-muted text-foreground",
};

interface KeyInsightsTabProps {
  insights: KnowledgeInsight[];
  researchProjectId: string;
}

export const KeyInsightsTab: FC<KeyInsightsTabProps> = ({ insights, researchProjectId }) => {
  const { save, savingId } = useSaveInsight(researchProjectId);
  const items = byTypes(insights, KEY_INSIGHT_TYPES);

  if (!items.length) {
    return <EmptyState icon={<Lightbulb className="h-5 w-5" />} title="No key insights yet" description="They'll show up here once the analysis finishes." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          typeLabel={getInsightTypeLabel(insight.type)}
          badgeClassName={badgeClassByType[insight.type]}
          onSave={() => save(insight.id)}
          isSaving={savingId === insight.id}
          footer={`Confidence ${getConfidenceLevel(insight.confidence_score)} · ${insight.supporting_count} supporting comments`}
        />
      ))}
    </div>
  );
};
