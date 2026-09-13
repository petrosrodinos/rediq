import { useMemo, type FC } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatTile } from "@/components/ui/stat-tile";
import { PipelineStepper } from "./pipeline-stepper";
import { BatchStatusCard } from "./batch-status-card";
import { LiveLogCard } from "./live-log-card";
import { useCancelAnalysisJob, useGetAnalysisJobBatchSubmissions, useGetAnalysisJobEvents, useRetryAnalysisJob } from "@/features/analysis-jobs/hooks/use-analysis-jobs";
import { useGetKnowledgeChunks } from "@/features/knowledge-chunks/hooks/use-knowledge-chunks";
import { AnalysisStatus, type ResearchProject } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { ProcessingMode, type AnalysisConfiguration } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";
import type { AnalysisJob } from "@/features/analysis-jobs/interfaces/analysis-jobs.interfaces";
import { getProcessingModeLabel } from "@/config/constants/dropdowns/research-projects/processing-mode-form.options";
import { formatRelativeTime } from "@/lib/date";
import { toSafeErrorMessage } from "@/lib/error-message";
import { Routes } from "@/routes/routes";
import { PIPELINE_STEPS, getPipelineStepStates } from "../utils/pipeline-steps";

interface AnalysisProgressViewProps {
  project: ResearchProject;
  job: AnalysisJob;
  configuration?: AnalysisConfiguration | null;
}

export const AnalysisProgressView: FC<AnalysisProgressViewProps> = ({ project, job, configuration }) => {
  const isRunning = job.status !== AnalysisStatus.COMPLETED && job.status !== AnalysisStatus.FAILED;
  const isBatch = configuration?.processing_mode === ProcessingMode.BATCH;

  const events = useGetAnalysisJobEvents(job.id, { limit: 30, order_by: "created_at", order_direction: "desc" }, { jobStatus: job.status });
  const batches = useGetAnalysisJobBatchSubmissions(job.id, { limit: 50 });
  const chunks = useGetKnowledgeChunks(project.id, { limit: 1 });
  const cancelJob = useCancelAnalysisJob();
  const retryJob = useRetryAnalysisJob();

  const overallPct = useMemo(() => {
    if (job.status === AnalysisStatus.COMPLETED) return 100;

    // The pipeline has several steps after data collection (embeddings, extraction,
    // synthesis) with no fine-grained counters of their own, so progress must be
    // spread across all steps, not just the posts/comments ratio — otherwise the
    // bar sits at ~98% for the whole embed/extract/synthesize duration.
    const states = getPipelineStepStates({
      status: job.status,
      posts_processed: job.posts_processed,
      comments_processed: job.comments_processed,
      prompt_tokens: job.prompt_tokens,
      completion_tokens: job.completion_tokens,
    });
    const workStepCount = PIPELINE_STEPS.length - 1; // exclude the final "ready"/completed step
    const stepWeight = 100 / workStepCount;
    const doneCount = states.filter((state) => state === "done").length;
    const activeIndex = states.indexOf("active");

    if (activeIndex === -1) return Math.min(98, Math.max(2, Math.round(doneCount * stepWeight)));

    let withinStepFraction = 0.5;
    if (activeIndex === 0) {
      const total = job.comments_total || job.posts_total;
      const processed = job.comments_total ? job.comments_processed : job.posts_processed;
      withinStepFraction = total ? Math.min(processed / total, 0.98) : 0.05;
    }

    return Math.min(98, Math.max(2, Math.round((doneCount + withinStepFraction) * stepWeight)));
  }, [job]);

  const timeLeftLabel = useMemo(() => {
    if (!isRunning) return null;
    if (!job.started_at || overallPct <= 0) return "Calculating…";
    const elapsedMs = Date.now() - new Date(job.started_at).getTime();
    const totalEstimateMs = (elapsedMs / overallPct) * 100;
    const remainingMs = Math.max(totalEstimateMs - elapsedMs, 0);
    const minutes = Math.round(remainingMs / 60000);
    return minutes <= 0 ? "Almost done" : `${minutes} min`;
  }, [isRunning, job.started_at, overallPct]);

  return (
    <div className="mx-auto max-w-[900px] animate-in space-y-5 fade-in slide-in-from-bottom-2 duration-500">
      <Card className="rounded-[20px]">
        <CardContent className="space-y-5 pt-6">
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {isRunning ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-75" /> : null}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${isRunning ? "bg-flame" : job.status === AnalysisStatus.COMPLETED ? "bg-moss" : "bg-rose"}`}
                  />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {isRunning ? "Running" : job.status === AnalysisStatus.COMPLETED ? "Completed" : "Failed"}
                  {job.started_at ? ` · started ${formatRelativeTime(job.started_at)}` : ""}
                </span>
              </div>
              <h2 className="font-display mt-2.5 text-2xl font-semibold">{project.name}</h2>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                r/{project.source?.community ?? "—"} · {job.posts_total || "?"} posts · {configuration ? getProcessingModeLabel(configuration.processing_mode) : "—"} mode
              </p>
            </div>
            {isRunning ? (
              <Button variant="outline" size="sm" loading={cancelJob.isPending} onClick={() => cancelJob.mutate(job.id)}>
                Cancel run
              </Button>
            ) : job.status === AnalysisStatus.COMPLETED ? (
              <Button size="sm" asChild>
                <Link to={Routes.dashboard.project(project.id)}>View report</Link>
              </Button>
            ) : (
              <Button size="sm" loading={retryJob.isPending} onClick={() => retryJob.mutate(job.id)}>
                Retry analysis
              </Button>
            )}
          </div>

          {job.status === AnalysisStatus.FAILED ? (
            <div className="flex gap-2.5 rounded-xl border border-rose/25 bg-rose-soft p-4">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose" />
              <p className="text-sm text-foreground">{toSafeErrorMessage(job.error_message)}</p>
            </div>
          ) : null}

          <div>
            <div className="mb-2 flex justify-between font-mono text-xs">
              <span>Overall progress</span>
              <span>{overallPct}%</span>
            </div>
            <Progress value={overallPct} active={isRunning} className="h-3" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Posts collected" value={`${job.posts_processed} / ${job.posts_total || "?"}`} />
              <StatTile label="Comments read" value={job.comments_processed.toLocaleString()} />
              <StatTile label="Chunks embedded" value={(chunks.data?.pagination.total ?? 0).toLocaleString()} isLoading={chunks.isLoading} />
              <StatTile label="Time left" value={timeLeftLabel ?? "—"} isLoading={isRunning && timeLeftLabel === "Calculating…"} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        <Card className="flex flex-col lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <PipelineStepper
              job={{
                status: job.status,
                posts_processed: job.posts_processed,
                comments_processed: job.comments_processed,
                prompt_tokens: job.prompt_tokens,
                completion_tokens: job.completion_tokens,
              }}
              currentStepDetail={job.current_step}
              activeProgressPct={isRunning ? overallPct : null}
              errorMessage={job.error_message}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          {isBatch ? <BatchStatusCard batches={batches.data?.data ?? []} /> : null}
          <LiveLogCard events={events.data?.data ?? []} isLoading={events.isLoading} isLive={isRunning} className="flex-1" />
        </div>
      </div>
    </div>
  );
};
