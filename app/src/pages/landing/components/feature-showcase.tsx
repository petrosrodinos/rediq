import type { FC, ReactNode } from "react";
import { Bookmark, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  detail: string;
  accent: "flame" | "sea" | "moss" | "amber";
  specimen: ReactNode;
}

const KnowledgeReportSpecimen: FC = () => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="text-[11px] text-muted-foreground">r/smallbusiness · 214 comments read</div>
    <div className="mt-3 grid grid-cols-3 gap-3 text-center">
      {[
        ["Problems", 12],
        ["Solutions", 8],
        ["Disagreements", 3],
      ].map(([label, count]) => (
        <div key={label} className="rounded-lg border border-border py-3">
          <div className="font-mono text-lg font-semibold tabular-nums">{count}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
    <p className="mt-3.5 text-[13.5px] leading-relaxed text-foreground">
      "Late invoicing is the most repeated complaint" —{" "}
      <span className="inline-flex items-center gap-1 rounded-md border border-border bg-flame-soft px-1.5 py-0.5 text-[11px] font-medium text-flame-deep">
        <b className="font-mono">4</b> comments
      </span>
    </p>
  </div>
);

const AssistantSpecimen: FC = () => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-secondary px-3.5 py-2.5 text-[13.5px]">
      Did anyone mention pricing as a reason for leaving?
    </div>
    <div className="mt-3 max-w-[90%] rounded-xl rounded-tl-sm border border-border px-3.5 py-2.5 text-[13.5px] leading-relaxed">
      No — across the 214 comments analyzed, pricing wasn't cited as a reason to switch. Onboarding friction was, in{" "}
      <span className="font-mono text-flame">3</span> separate threads.
    </div>
    <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-sea-soft px-2 py-1 text-[11px] font-medium text-sea">
      <Sparkles className="h-3 w-3" />
      Grounded — answers only from analyzed comments
    </div>
  </div>
);

const SearchSpecimen: FC = () => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <Search className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-mono text-[13px] text-foreground">what made people switch tools</span>
    </div>
    <div className="mt-3 space-y-2.5">
      {["r/saas · 12 matches", "r/freelance · 7 matches", "r/bookkeeping · 4 matches"].map((row) => (
        <div key={row} className="flex items-center justify-between border-t border-border pt-2.5 text-[13px]">
          <span className="text-foreground">{row.split(" · ")[0]}</span>
          <span className="font-mono text-muted-foreground">{row.split(" · ")[1]}</span>
        </div>
      ))}
    </div>
  </div>
);

const SavedInsightsSpecimen: FC = () => (
  <div className="rounded-2xl border border-border bg-card p-5">
    {["Onboarding friction drives churn", "Bookkeepers want fewer logins", "Referrals outperform paid ads"].map((title, i) => (
      <div key={title} className={cn("flex items-center gap-2.5 py-2.5", i > 0 && "border-t border-border")}>
        <Bookmark className="h-3.5 w-3.5 shrink-0 text-amber" />
        <span className="text-[13px] text-foreground">{title}</span>
      </div>
    ))}
  </div>
);

const FEATURES: Feature[] = [
  {
    title: "Every claim carries its source",
    detail:
      "Facts, opinions, problems, and trends are extracted into a structured report — each one links back to the exact post or comment it came from, so you can verify it instead of taking the summary's word for it.",
    accent: "flame",
    specimen: <KnowledgeReportSpecimen />,
  },
  {
    title: "An assistant that only knows what you showed it",
    detail:
      "Ask follow-up questions and get answers drawn only from the threads you analyzed. When the data doesn't say something, it tells you that instead of filling the gap with outside knowledge.",
    accent: "sea",
    specimen: <AssistantSpecimen />,
  },
  {
    title: "Search across every thread you've read",
    detail: "Find what people actually said, in their own words, across all your analyzed communities at once — filtered by score, time range, or a single project.",
    accent: "moss",
    specimen: <SearchSpecimen />,
  },
  {
    title: "Keep the insights, skip the re-reading",
    detail: "Save individual insights to a running knowledge base you can come back to without opening the thread again.",
    accent: "amber",
    specimen: <SavedInsightsSpecimen />,
  },
];

export const FeatureShowcase: FC = () => {
  return (
    <section id="features" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <h2 className="font-display max-w-[22ch] text-[28px] font-semibold tracking-tight sm:text-[32px]">Not just a summarizer.</h2>
        <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
          A plain "summarize this subreddit" tool gives you prose you have to trust. This gives you a paper trail.
        </p>

        <div className="mt-14 space-y-20">
          {FEATURES.map((feature, i) => (
            <div key={feature.title} className={cn("grid items-center gap-10 lg:grid-cols-2", i % 2 === 1 && "lg:[&>*:first-child]:order-2")}>
              <div>
                <h3 className="font-display text-[20px] font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 max-w-[48ch] text-[14.5px] leading-relaxed text-muted-foreground">{feature.detail}</p>
              </div>
              {feature.specimen}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
