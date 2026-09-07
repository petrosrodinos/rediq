import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactNumber } from "@/lib/format-number";
import { Routes } from "@/routes/routes";

interface HeroPanelProps {
  commentsIndexed: number;
  insightsKept: number;
  sourcesPerInsight: number | null;
  projectsCount: number;
  isLoading: boolean;
}

export const HeroPanel: FC<HeroPanelProps> = ({ commentsIndexed, insightsKept, sourcesPerInsight, projectsCount, isLoading }) => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const submit = () => {
    navigate(Routes.dashboard.new_analysis, { state: url ? { url } : undefined });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-night text-white shadow-lg">
      <div
        className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full opacity-70"
        style={{ background: "radial-gradient(circle, rgba(255,69,0,.55) 0%, rgba(255,69,0,0) 68%)" }}
      />
      <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_300px] lg:items-end">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.08] py-1 pl-1.5 pr-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flame">
              <ArrowRight className="h-3 w-3 -rotate-45" />
            </span>
            <span className="text-[11.5px] text-white/70">
              {isLoading ? "Loading your workspace…" : `${formatCompactNumber(commentsIndexed)} comments indexed and citable`}
            </span>
          </div>

          <h2 className="font-display mt-5 max-w-[19ch] text-[32px] font-semibold leading-[1.05] tracking-tight sm:text-[42px]">
            Turn a subreddit into evidence you can cite.
          </h2>
          <p className="mt-3.5 max-w-[58ch] text-[14.5px] leading-relaxed text-white/55">
            Threadline reads the posts and the comment trees, groups what people actually repeat, and keeps every claim
            attached to the comment it came from.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[.06] px-3.5 py-2.5 transition-colors focus-within:border-flame/60">
              <Search className="h-4 w-4 shrink-0 text-white/35" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="reddit.com/r/smallbusiness/comments/1f8k2x"
                spellCheck={false}
                aria-label="Reddit URL"
                className="min-w-0 flex-1 bg-transparent font-mono text-[14px] text-white outline-none placeholder:text-white/30"
              />
            </div>
            <Button onClick={submit} className="shrink-0">
              Analyse thread
            </Button>
          </div>
          <p className="mt-2.5 text-[11.5px] text-white/35">Public threads only. A run of 200 posts takes about eight minutes.</p>
        </div>

        <div className="space-y-3.5 lg:border-l lg:border-white/10 lg:pl-8">
          <div className="text-[11px] text-white/40">This workspace</div>
          {[
            ["Comments read", formatCompactNumber(commentsIndexed)],
            ["Insights kept", formatCompactNumber(insightsKept)],
            ["Sources per insight", sourcesPerInsight !== null ? sourcesPerInsight.toFixed(1) : "—"],
            ["Projects", formatCompactNumber(projectsCount)],
          ].map(([label, value], index) => (
            <div key={label}>
              {index > 0 ? <div className="mb-3.5 h-px bg-white/10" /> : null}
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] text-white/55">{label}</span>
                {isLoading ? (
                  <Skeleton className="h-6 w-10 bg-white/10" />
                ) : (
                  <span className="font-display text-[22px] font-semibold tabular-nums">{value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
