import type { FC } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { AnalysisProgressView } from "./components/analysis-progress-view";
import { useGetAnalysisJob } from "@/features/analysis-jobs/hooks/use-analysis-jobs";
import { useGetResearchProject } from "@/features/research-projects/hooks/use-research-projects";
import { useGetAnalysisConfiguration } from "@/features/analysis-configurations/hooks/use-analysis-configurations";
import { AlertTriangle } from "lucide-react";

const AnalysisProgressPage: FC = () => {
  const { jobId = "" } = useParams<{ jobId: string }>();

  const job = useGetAnalysisJob(jobId);
  const project = useGetResearchProject(job.data?.research_project_uuid ?? "");
  const configuration = useGetAnalysisConfiguration(job.data?.analysis_configuration_uuid ?? "");

  if (job.isLoading || (job.data && project.isLoading)) {
    return (
      <div className="mx-auto max-w-[900px] space-y-5">
        <Skeleton className="h-48 w-full rounded-[20px]" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (job.isError || !job.data || !project.data) {
    return (
      <div className="mx-auto max-w-[900px]">
        <EmptyState icon={<AlertTriangle className="h-5 w-5" />} title="We couldn't find that analysis job" description="It may have been deleted, or the link is out of date." />
      </div>
    );
  }

  return <AnalysisProgressView project={project.data} job={job.data} configuration={configuration.data} />;
};

export default AnalysisProgressPage;
