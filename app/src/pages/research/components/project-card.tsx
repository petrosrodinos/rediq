import type { FC } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Pencil, RefreshCw, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisStatusBadge } from "@/components/ui/analysis-status-badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ResearchProject } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { formatRelativeTime } from "@/lib/date";
import { Routes } from "@/routes/routes";
import { toast } from "@/hooks/use-toast";

interface ProjectCardProps {
  project: ResearchProject;
  onRename: () => void;
  onDelete: () => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project, onRename, onDelete }) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <AnalysisStatusBadge status={project.status} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRename}>
              <Pencil className="h-3.5 w-3.5" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Rerun queued", description: "This will start a fresh analysis job.", duration: 2000 })}>
              <RefreshCw className="h-3.5 w-3.5" />
              Rerun
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Export started", description: "We'll prepare a download shortly.", duration: 2000 })}>
              <Download className="h-3.5 w-3.5" />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{project.name}</p>
        <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
          {project.source?.community ? `r/${project.source.community}` : "—"} · {project.posts_analyzed} posts ·{" "}
          {project.comments_analyzed || "collecting"} comments
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Updated {formatRelativeTime(project.updated_at)}</span>
        <Button size="sm" asChild>
          <Link to={Routes.dashboard.project(project.id)}>Open</Link>
        </Button>
      </div>
    </div>
  );
};
