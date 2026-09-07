import type { FC } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MiniBarChart, type MiniBarChartDatum } from "@/components/ui/mini-bar-chart";
import { Routes } from "@/routes/routes";

interface ThisMonthCardProps {
  analysesRun: number;
  commentsProcessed: number;
  assistantQuestions: number;
  chartData: MiniBarChartDatum[];
  isLoading: boolean;
}

export const ThisMonthCard: FC<ThisMonthCardProps> = ({ analysesRun, commentsProcessed, assistantQuestions, chartData, isLoading }) => {
  return (
    <Card className="p-5">
      <CardTitle className="text-[15px]">This month</CardTitle>
      <CardContent className="space-y-3 p-0 pt-4">
        {[
          ["Analyses run", analysesRun],
          ["Comments processed", commentsProcessed],
          ["Assistant questions", assistantQuestions],
        ].map(([label, value]) => (
          <div key={label as string} className="flex items-baseline justify-between">
            <span className="text-[13px] text-muted-foreground">{label}</span>
            {isLoading ? <Skeleton className="h-4 w-10" /> : <span className="font-mono text-[13px] font-semibold">{value}</span>}
          </div>
        ))}
      </CardContent>
      {chartData.length > 0 ? (
        <div className="mt-5 border-t border-border pt-4">
          <MiniBarChart data={chartData} className="h-[70px]" highlightIndex={chartData.length - 1} />
          <div className="mt-2 font-mono text-[10px] text-muted-foreground">Comments processed across your most recent projects.</div>
        </div>
      ) : null}
    </Card>
  );
};

export const AskAssistantCard: FC = () => {
  return (
    <Card className="p-5">
      <CardTitle className="text-[15px]">Ask about your evidence</CardTitle>
      <CardContent className="space-y-2 p-0 pt-1.5">
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          The assistant only answers from comments inside your projects, with citations attached.
        </p>
        <div className="space-y-2 pt-1.5">
          <Link
            to={Routes.dashboard.assistant}
            className="block rounded-lg border border-border px-3 py-2 text-left text-[13px] hover:border-foreground/20"
          >
            Which tool gets recommended to solo freelancers?
          </Link>
          <Link
            to={Routes.dashboard.assistant}
            className="block rounded-lg border border-border px-3 py-2 text-left text-[13px] hover:border-foreground/20"
          >
            What breaks during migration?
          </Link>
        </div>
        <Button variant="secondary" className="mt-1 w-full" asChild>
          <Link to={Routes.dashboard.assistant}>Open assistant</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

interface EvidenceQualityCardProps {
  qualityPct: number | null;
  isLoading: boolean;
}

export const EvidenceQualityCard: FC<EvidenceQualityCardProps> = ({ qualityPct, isLoading }) => {
  const pct = qualityPct ?? 0;
  return (
    <Card className="p-5">
      <CardTitle className="text-[15px]">Evidence quality</CardTitle>
      <CardContent className="space-y-3 p-0 pt-3">
        <div className="flex items-baseline gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <span className="font-display text-[34px] font-semibold">{qualityPct === null ? "—" : `${Math.round(pct)}%`}</span>
          )}
          <span className="text-[13px] text-muted-foreground">of sampled insights cite 3 or more comments</span>
        </div>
        <div className="flex h-2 gap-1">
          <div className="rounded-l bg-moss" style={{ flex: pct || 0.01 }} />
          <div className="rounded-r border border-border bg-muted" style={{ flex: 100 - pct }} />
        </div>
      </CardContent>
    </Card>
  );
};
