import { type FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, List, FolderSearch, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { Pagination } from "@/components/ui/pagination";
import { ProjectCard } from "./components/project-card";
import { ProjectTable } from "./components/project-table";
import { RenameProjectDialog } from "./components/rename-project-dialog";
import { useDeleteResearchProject, useGetResearchProjects } from "@/features/research-projects/hooks/use-research-projects";
import { AnalysisStatus, type AnalysisStatusType, type ResearchProject } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { AnalysisStatusFilterOptions } from "@/config/constants/dropdowns/research-projects/analysis-status-filter.options";
import { Routes } from "@/routes/routes";

type SortOption = "updated_at" | "name" | "comments_analyzed";

const ResearchListPage: FC = () => {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AnalysisStatusType | "all">("all");
  const [sort, setSort] = useState<SortOption>("updated_at");
  const [page, setPage] = useState(1);
  const [renameTarget, setRenameTarget] = useState<ResearchProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResearchProject | null>(null);

  const projects = useGetResearchProjects({
    page,
    limit: 12,
    search: search || undefined,
    status: status === "all" ? undefined : status,
    order_by: sort === "comments_analyzed" ? "updated_at" : sort,
    order_direction: "desc",
  });

  const deleteProject = useDeleteResearchProject();

  const sortedProjects = useMemo(() => {
    const data = projects.data?.data ?? [];
    if (sort !== "comments_analyzed") return data;
    return [...data].sort((a, b) => b.comments_analyzed - a.comments_analyzed);
  }, [projects.data, sort]);

  const runningCount = sortedProjects.filter((project) => project.status !== AnalysisStatus.COMPLETED && project.status !== AnalysisStatus.FAILED).length;

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My research</h1>
          <p className="text-sm text-muted-foreground">
            {projects.data?.pagination.total ?? 0} projects · {runningCount} running
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup type="single" variant="outline" value={view} onValueChange={(value) => value && setView(value as "cards" | "table")}>
            <ToggleGroupItem value="cards" aria-label="Cards view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button asChild>
            <Link to={Routes.dashboard.new_analysis}>
              <Plus className="h-4 w-4" />
              New analysis
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="w-full sm:w-64"
          placeholder="Filter by name or subreddit"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as AnalysisStatusType | "all");
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Filter by status" className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AnalysisStatusFilterOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
          <SelectTrigger aria-label="Sort by" className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_at">Last updated</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="comments_analyzed">Most comments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {projects.isLoading ? (
        view === "cards" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )
      ) : !sortedProjects.length ? (
        <EmptyState
          icon={<FolderSearch className="h-5 w-5" />}
          title="No research projects yet"
          description="Point Threadline at a subreddit or thread to start building your first cited report."
          action={
            <Button asChild>
              <Link to={Routes.dashboard.new_analysis}>Start new analysis</Link>
            </Button>
          }
        />
      ) : (
        <>
          {view === "cards" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onRename={() => setRenameTarget(project)} onDelete={() => setDeleteTarget(project)} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border">
              <ProjectTable projects={sortedProjects} onDelete={setDeleteTarget} />
            </div>
          )}

          {projects.data ? (
            <Pagination
              className="pt-2"
              currentPage={projects.data.pagination.page}
              totalPages={projects.data.pagination.total_pages}
              onPageChange={setPage}
            />
          ) : null}
        </>
      )}

      <RenameProjectDialog
        projectId={renameTarget?.id ?? null}
        currentName={renameTarget?.name ?? ""}
        isOpen={!!renameTarget}
        onClose={() => setRenameTarget(null)}
      />

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteProject.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
        }}
        title="Delete this research project?"
        description={`"${deleteTarget?.name}" and everything collected for it will be permanently removed. This can't be undone.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteProject.isPending}
      />
    </div>
  );
};

export default ResearchListPage;
