import type { FC } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useGetAnalysisJob } from "@/features/analysis-jobs/hooks/use-analysis-jobs";
import { Routes } from "@/routes/routes";
import { AlertTriangle } from "lucide-react";

// Legacy/bookmarked entry point for a single job. The project page at
// Routes.dashboard.project renders the exact same running/failed progress view
// (and the full report once complete), so this route just forwards there.
const AnalysisProgressPage: FC = () => {
  const { jobId = "" } = useParams<{ jobId: string }>();

  const job = useGetAnalysisJob(jobId);

  if (job.isLoading) {
    return (
      <div className="mx-auto max-w-[900px] space-y-5">
        <Skeleton className="h-48 w-full rounded-[20px]" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (job.isError || !job.data) {
    return (
      <div className="mx-auto max-w-[900px]">
        <EmptyState icon={<AlertTriangle className="h-5 w-5" />} title="We couldn't find that analysis job" description="It may have been deleted, or the link is out of date." />
      </div>
    );
  }

  return <Navigate to={Routes.dashboard.project(job.data.research_project_uuid)} replace />;
};

export default AnalysisProgressPage;
