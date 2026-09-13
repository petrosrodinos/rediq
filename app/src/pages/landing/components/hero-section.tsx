import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";
import { environments } from "@/config/environments";

interface AnnotatedComment {
  n: number;
  points: number;
  before: string;
  highlight: string;
  after: string;
}

const COMMENTS: AnnotatedComment[] = [
  {
    n: 47,
    points: 12,
    before: "we switched providers twice this year because the ",
    highlight: "onboarding call took three weeks to schedule",
    after: " — not because of price.",
  },
  {
    n: 103,
    points: 21,
    before: "same story here. the tool was fine, ",
    highlight: "the onboarding call was the actual problem",
    after: ".",
  },
];

const Pin: FC<{ n: number; className?: string }> = ({ n, className }) => (
  <span className={"inline-flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-flame px-[3px] font-mono text-[9.5px] font-medium leading-none text-white " + (className ?? "")}>
    {n}
  </span>
);

const Highlight: FC<{ pin: number; children: ReactNode }> = ({ pin, children }) => (
  <span className="whitespace-nowrap rounded-[3px] bg-flame/25 px-0.5 py-px text-white">
    {children}
    <Pin n={pin} className="relative -top-1 ml-0.5" />
  </span>
);

const ThreadSpecimen: FC = () => (
  <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5 sm:p-6">
    <div className="flex items-center justify-between text-[11.5px] text-white/40">
      <span>r/smallbusiness</span>
      <span>214 comments read</span>
    </div>

    <div className="mt-4 space-y-4">
      {COMMENTS.map((comment, i) => (
        <p key={comment.n} className="text-[13.5px] leading-relaxed text-white/70">
          <span className="font-mono text-[11px] text-white/35">
            comment #{comment.n} · {comment.points} pts
          </span>
          <br />
          &ldquo;{comment.before}
          <Highlight pin={i + 1}>{comment.highlight}</Highlight>
          {comment.after}&rdquo;
        </p>
      ))}
    </div>

    <div className="mt-5 border-t border-white/10 pt-4">
      <p className="font-display text-[15.5px] font-medium leading-snug text-white">Most switches trace back to onboarding friction, not price.</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-white/45">
        {COMMENTS.map((comment, i) => (
          <span key={comment.n} className="inline-flex items-center gap-1.5">
            <Pin n={i + 1} />
            comment #{comment.n}
          </span>
        ))}
        <span className="ml-auto font-mono text-white/70">{COMMENTS.length}/{COMMENTS.length} independent</span>
      </div>
    </div>
  </div>
);

export const HeroSection: FC = () => {
  return (
    <section className="relative overflow-hidden bg-night text-white">
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, rgba(255,69,0,.5) 0%, rgba(255,69,0,0) 68%)" }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:py-28 lg:grid-cols-[1fr_460px] lg:items-center">
        <div className="min-w-0">
          <h1 className="font-display max-w-[15ch] text-[38px] font-semibold leading-[1.08] tracking-tight sm:text-[52px]">
            Nobody reads past the third comment. {environments.APP_NAME} does.
          </h1>
          <p className="mt-6 max-w-[54ch] text-[16px] leading-relaxed text-white/60">
            It reads every comment in the thread, keeps what people actually repeat, and pins each claim to the comment it came from — so you can quote it, not
            paraphrase it.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link to={Routes.auth.sign_up}>
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link to={Routes.auth.sign_in}>Sign in</Link>
            </Button>
          </div>
          <p className="mt-4 text-[12.5px] text-white/35">Public threads only. No credit card required.</p>
        </div>

        <ThreadSpecimen />
      </div>
    </section>
  );
};
