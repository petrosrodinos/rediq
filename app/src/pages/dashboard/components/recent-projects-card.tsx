import type { FC } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { AnalysisStatusBadge } from "@/components/ui/analysis-status-badge";
import { Button } from "@/components/ui/button";
import { FolderSearch } from "lucide-react";
import type { ResearchProject } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { formatCompactNumber } from "@/lib/format-number";
import { formatRelativeTime } from "@/lib/date";
import { Routes } from "@/routes/routes";

interface RecentProjectsCardProps {
  projects: ResearchProject[];
  isLoading: boolean;
}

export const RecentProjectsCard: FC<RecentProjectsCardProps> = ({ projects, isLoading }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border py-3.5">
        <CardTitle className="text-[15px]">Recent projects</CardTitle>
        <Button variant="link" size="sm" className="h-auto p-0 text-flame" asChild>
          <Link to={Routes.dashboard.research}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-4 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-2/5" />
                  <Skeleton className="h-2.5 w-3/5" />
                </div>
              </div>
            ))}
          </div>
        ) : !projects.length ? (
          <EmptyState
            className="border-0"
            icon={<FolderSearch className="h-5 w-5" />}
            title="No research projects yet"
            description="Start your first analysis to see it here."
            action={
              <Button asChild size="sm">
                <Link to={Routes.dashboard.new_analysis}>Start new analysis</Link>
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {projects.map((project) => {
              return (
                <Link
                  key={project.id}
                  to={Routes.dashboard.project(project.id)}
                  className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-accent font-mono text-[11px] font-semibold text-accent-foreground">
                    {project.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{project.name}</span>
                    <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground">
                      {project.source?.community ? `r/${project.source.community} · ` : ""}
                      {formatCompactNumber(project.posts_analyzed)} posts ·{" "}
                      {project.comments_analyzed ? `${formatCompactNumber(project.comments_analyzed)} comments` : "collecting comments"} · updated{" "}
                      {formatRelativeTime(project.updated_at)}
                    </span>
                  </span>
                  <AnalysisStatusBadge status={project.status} className="shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
