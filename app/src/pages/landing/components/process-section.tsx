import type { FC } from "react";
import { environments } from "@/config/environments";

const STEPS = [
  {
    title: "Paste a link",
    detail: "Drop in a subreddit or a single post URL — nothing to configure first.",
  },
  {
    title: `${environments.APP_NAME} reads all of it`,
    detail: "Every comment in the thread, not just the top few — that's where the actual answer usually is.",
  },
  {
    title: "Get a cited report",
    detail: "Facts, problems, solutions, and disagreements, each pinned to the comment it came from.",
  },
  {
    title: "Ask follow-ups",
    detail: "The assistant answers only from what it read, and says so plainly when it can't.",
  },
];

export const ProcessSection: FC = () => {
  return (
    <section id="process" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <h2 className="font-display max-w-[20ch] text-[28px] font-semibold tracking-tight sm:text-[32px]">From raw thread to cited report in four steps.</h2>

        <div className="relative mt-14 max-w-xl">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative pl-9">
                <div className="absolute left-0 top-[3px] h-[15px] w-[15px] rounded-full border-2 border-flame bg-background" />
                <div className="font-mono text-[11px] text-flame">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display mt-1 text-[17px] font-semibold">{step.title}</h3>
                <p className="mt-1.5 max-w-[50ch] text-[14px] leading-relaxed text-muted-foreground">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
