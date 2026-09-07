import { useEffect, type FC } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FolderX } from "lucide-react";
import { ProjectHeader } from "./components/project-header";
import { OverviewTab } from "./components/tabs/overview-tab";
import { KeyInsightsTab } from "./components/tabs/key-insights-tab";
import { TopicsTab } from "./components/tabs/topics-tab";
import { ProblemsTab } from "./components/tabs/problems-tab";
import { SolutionsTab } from "./components/tabs/solutions-tab";
import { OpinionsTab } from "./components/tabs/opinions-tab";
import { ProductsTab } from "./components/tabs/products-tab";
import { StatisticsTab } from "./components/tabs/statistics-tab";
import { FaqTab } from "./components/tabs/faq-tab";
import { SourcesTab } from "./components/tabs/sources-tab";
import { AssistantTab } from "./components/tabs/assistant-tab";
import { AnalysisProgressView } from "@/pages/analysis-progress/components/analysis-progress-view";
import { useGetResearchProject } from "@/features/research-projects/hooks/use-research-projects";
import { useGetAnalysisJobs, useCreateAnalysisJob } from "@/features/analysis-jobs/hooks/use-analysis-jobs";
import { useGetAnalysisConfiguration } from "@/features/analysis-configurations/hooks/use-analysis-configurations";
import { useGetKnowledgeInsights } from "@/features/knowledge-insights/hooks/use-knowledge-insights";
import { useGetTopics } from "@/features/topics/hooks/use-topics";
import { useGetPosts } from "@/features/posts/hooks/use-posts";
import { useExportResearchProject } from "@/features/export/hooks/use-export";
import { AnalysisStatus } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { RUNNING_ANALYSIS_STATUSES } from "@/config/constants/dropdowns/research-projects/analysis-status-form.options";
import { KnowledgeInsightOrderByFields, KnowledgeInsightOrderDirections } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { useActiveProjectStore } from "@/stores/active-project";
import { Routes } from "@/routes/routes";

const TABS = [
  "overview",
  "key-insights",
  "topics",
  "problems",
  "solutions",
  "opinions",
  "products",
  "statistics",
  "faq",
  "sources",
  "assistant",
] as const;

const ProjectDetailPage: FC = () => {
  const { projectId = "" } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setActiveProject = useActiveProjectStore((state) => state.setActiveProject);

  const project = useGetResearchProject(projectId);
  const jobs = useGetAnalysisJobs(projectId, { limit: 1, order_by: "created_at", order_direction: "desc" });
  const latestJob = jobs.data?.data[0];
  const configuration = useGetAnalysisConfiguration(latestJob?.analysis_configuration_uuid ?? "");

  const isRunning = !!project.data && RUNNING_ANALYSIS_STATUSES.includes(project.data.status);
  const isCompleted = project.data?.status === AnalysisStatus.COMPLETED;

  const insights = useGetKnowledgeInsights(isCompleted ? projectId : "", {
    limit: 200,
    order_by: KnowledgeInsightOrderByFields.SUPPORTING_COUNT,
    order_direction: KnowledgeInsightOrderDirections.DESC,
  });
  const topics = useGetTopics(isCompleted ? projectId : "", { limit: 100 });
  const posts = useGetPosts(isCompleted ? projectId : "", { limit: 100 });

  const exportProject = useExportResearchProject();
  const createJob = useCreateAnalysisJob();

  useEffect(() => {
    if (project.data) setActiveProject({ id: project.data.id, name: project.data.name });
  }, [project.data, setActiveProject]);

  const tab = TABS.includes(searchParams.get("tab") as (typeof TABS)[number]) ? (searchParams.get("tab") as (typeof TABS)[number]) : "overview";

  const handleExport = async () => {
    const report = await exportProject.mutateAsync({ researchProjectId: projectId, query: { format: "markdown" } });
    const content = typeof report === "string" ? report : JSON.stringify(report, null, 2);
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.data?.name ?? "report"}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRerun = async () => {
    if (!latestJob) return;
    const job = await createJob.mutateAsync({ researchProjectId: projectId, dto: { analysis_configuration_uuid: latestJob.analysis_configuration_uuid } });
    navigate(Routes.dashboard.analysis_job(job.id));
  };

  if (project.isLoading) {
    return (
      <div className="mx-auto max-w-[1180px] space-y-5">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (project.isError || !project.data) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <EmptyState icon={<FolderX className="h-5 w-5" />} title="We couldn't find this project" description="It may have been deleted." />
      </div>
    );
  }

  if (isRunning || project.data.status === AnalysisStatus.FAILED) {
    if (jobs.isLoading) {
      return (
        <div className="mx-auto max-w-[900px]">
          <Skeleton className="h-96 w-full rounded-[20px]" />
        </div>
      );
    }

    if (!latestJob) {
      return (
        <div className="mx-auto max-w-[900px]">
          <EmptyState icon={<AlertTriangle className="h-5 w-5" />} title="No analysis job found for this project" />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <AnalysisProgressView project={project.data} job={latestJob} configuration={configuration.data} />
        {project.data.status === AnalysisStatus.FAILED ? (
          <div className="mx-auto flex max-w-[900px] justify-center">
            <Button variant="outline" onClick={() => navigate(`${Routes.dashboard.new_analysis}?url=${encodeURIComponent(project.data!.source?.url ?? "")}`)}>
              Start a new analysis
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <ProjectHeader
        project={project.data}
        onExport={handleExport}
        isExporting={exportProject.isPending}
        onRerun={handleRerun}
        isRerunning={createJob.isPending}
      />

      <Tabs
        value={tab}
        onValueChange={(value) => {
          const next = new URLSearchParams(searchParams);
          next.set("tab", value);
          setSearchParams(next, { replace: true });
        }}
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="key-insights">Key insights</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
          <TabsTrigger value="opinions">Opinions</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="assistant">AI assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            project={project.data}
            insights={insights.data?.data ?? []}
            topics={topics.data?.data ?? []}
            posts={posts.data?.data ?? []}
            job={latestJob}
            configuration={configuration.data}
          />
        </TabsContent>
        <TabsContent value="key-insights">
          <KeyInsightsTab insights={insights.data?.data ?? []} researchProjectId={projectId} />
        </TabsContent>
        <TabsContent value="topics">
          <TopicsTab topics={topics.data?.data ?? []} insights={insights.data?.data ?? []} />
        </TabsContent>
        <TabsContent value="problems">
          <ProblemsTab insights={insights.data?.data ?? []} />
        </TabsContent>
        <TabsContent value="solutions">
          <SolutionsTab insights={insights.data?.data ?? []} />
        </TabsContent>
        <TabsContent value="opinions">
          <OpinionsTab insights={insights.data?.data ?? []} />
        </TabsContent>
        <TabsContent value="products">
          <ProductsTab insights={insights.data?.data ?? []} />
        </TabsContent>
        <TabsContent value="statistics">
          <StatisticsTab insights={insights.data?.data ?? []} posts={posts.data?.data ?? []} />
        </TabsContent>
        <TabsContent value="faq">
          <FaqTab insights={insights.data?.data ?? []} />
        </TabsContent>
        <TabsContent value="sources">
          <SourcesTab project={project.data} previewPosts={posts.data?.data ?? []} />
        </TabsContent>
        <TabsContent value="assistant">
          <AssistantTab researchProjectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailPage;
