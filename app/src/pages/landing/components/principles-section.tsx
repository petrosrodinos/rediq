import type { FC } from "react";

const PRINCIPLES = [
  "Every number and claim links back to the comment it came from.",
  "Read deep, not wide — rank and deduplicate instead of skimming the top comments.",
  "The assistant says \"I don't know\" before it guesses.",
  "Reddit content is treated as untrusted input, never as instructions.",
];

export const PrinciplesSection: FC = () => {
  return (
    <section id="principles" className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <h2 className="font-display max-w-[20ch] text-[28px] font-semibold tracking-tight sm:text-[32px]">Principles we build to.</h2>

        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {PRINCIPLES.map((principle, i) => (
            <div key={principle} className="flex gap-4 border-l-2 border-flame/30 pl-5">
              <span className="shrink-0 font-mono text-[12px] text-flame">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[14.5px] leading-relaxed text-foreground/80">{principle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
