import type { FC } from "react";
import { Link } from "react-router-dom";
import { Download, MessageCircleQuestion, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisStatusBadge } from "@/components/ui/analysis-status-badge";
import type { ResearchProject } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { formatRelativeTime } from "@/lib/date";
import { Routes } from "@/routes/routes";

interface ProjectHeaderProps {
  project: ResearchProject;
  onExport: () => void;
  isExporting: boolean;
  onRerun: () => void;
  isRerunning: boolean;
}

export const ProjectHeader: FC<ProjectHeaderProps> = ({ project, onExport, isExporting, onRerun, isRerunning }) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <AnalysisStatusBadge status={project.status} />
          <span className="font-mono text-[11px] text-muted-foreground">Updated {formatRelativeTime(project.updated_at)}</span>
        </div>
        <h1 className="font-display mt-1.5 text-2xl font-semibold">{project.name}</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          r/{project.source?.community ?? "—"} · {project.posts_analyzed.toLocaleString()} posts · {project.comments_analyzed.toLocaleString()} comments
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onExport} loading={isExporting}>
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onRerun} loading={isRerunning}>
          <RefreshCw className="h-3.5 w-3.5" />
          Rerun
        </Button>
        <Button size="sm" asChild>
          <Link to={`${Routes.dashboard.assistant}?project=${project.id}`}>
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            Ask the assistant
          </Link>
        </Button>
      </div>
    </div>
  );
};
