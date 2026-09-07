import type { FC } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BatchSubmissionStatus, type BatchSubmission } from "@/features/analysis-jobs/interfaces/analysis-jobs.interfaces";

interface BatchStatusCardProps {
  batches: BatchSubmission[];
}

const cellClassByStatus: Record<string, string> = {
  [BatchSubmissionStatus.COMPLETED]: "bg-moss",
  [BatchSubmissionStatus.IN_PROGRESS]: "bg-flame",
  [BatchSubmissionStatus.VALIDATING]: "bg-flame/60",
  [BatchSubmissionStatus.FINALIZING]: "bg-flame/60",
  [BatchSubmissionStatus.FAILED]: "bg-rose",
  [BatchSubmissionStatus.EXPIRED]: "bg-rose",
  [BatchSubmissionStatus.CANCELLED]: "bg-muted-foreground/40",
};

export const BatchStatusCard: FC<BatchStatusCardProps> = ({ batches }) => {
  if (!batches.length) return null;

  const done = batches.filter((b) => b.status === BatchSubmissionStatus.COMPLETED).length;
  const running = batches.filter((b) => b.status === BatchSubmissionStatus.IN_PROGRESS).length;
  const queued = batches.length - done - running;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Batch status</CardTitle>
        <Badge variant="outline" className="border-sea/30 bg-sea-soft text-sea">
          In progress
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-mono text-[11px] text-muted-foreground">Batch id {batches[0]?.openai_batch_id.slice(0, 10)}…</p>
        <div className="grid grid-cols-11 gap-1">
          {batches.map((batch) => (
            <div key={batch.id} className={cn("h-6 rounded border border-border", cellClassByStatus[batch.status] ?? "bg-muted")} title={batch.status} />
          ))}
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          {done} done · {running} running · {queued} queued
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You can close this tab. We'll email you when the report is ready.
        </p>
      </CardContent>
    </Card>
  );
};
