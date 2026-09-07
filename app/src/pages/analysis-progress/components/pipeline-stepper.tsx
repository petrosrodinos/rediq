import type { FC } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { PIPELINE_STEPS, getPipelineStepStates, type PipelineProgressSignal } from "../utils/pipeline-steps";

interface PipelineStepperProps {
  job: PipelineProgressSignal;
  currentStepDetail?: string | null;
  activeProgressPct?: number | null;
  errorMessage?: string | null;
}

export const PipelineStepper: FC<PipelineStepperProps> = ({ job, currentStepDetail, activeProgressPct, errorMessage }) => {
  const states = getPipelineStepStates(job);

  return (
    <ol className="space-y-0">
      {PIPELINE_STEPS.map((step, index) => {
        const state = states[index];
        const isLast = index === PIPELINE_STEPS.length - 1;

        return (
          <li key={step.key} className={cn("relative flex gap-3", !isLast && "pb-4")}>
            {!isLast ? <span className="absolute left-[11px] top-6 bottom-0 w-px bg-border" /> : null}
            <span
              className={cn(
                "z-10 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border border-border",
                state === "done" && "border-transparent bg-moss",
                state === "failed" && "border-transparent bg-rose",
                state === "pending" && "bg-muted",
                state === "active" && "bg-card",
              )}
            >
              {state === "done" ? <Check className="h-3 w-3 text-white" /> : null}
              {state === "active" ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-flame" /> : null}
              {state === "failed" ? <span className="text-[11px] font-bold text-white">!</span> : null}
            </span>
            <div className="min-w-0 flex-1">
              <div className={cn("text-sm font-semibold", state === "pending" && "text-muted-foreground")}>{step.label}</div>
              {state === "active" ? (
                <>
                  <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{currentStepDetail ?? "Working…"}</div>
                  {typeof activeProgressPct === "number" ? <Progress value={activeProgressPct} className="mt-2 h-1.5 max-w-[280px]" /> : null}
                </>
              ) : state === "failed" ? (
                <div className="mt-0.5 text-[11px] text-rose">{errorMessage ?? "This step failed."}</div>
              ) : state === "pending" ? (
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">Waiting</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
};
