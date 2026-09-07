import type { FC } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AnalysisStatusBadge } from "@/components/ui/analysis-status-badge";
import type { ResearchProject } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { formatRelativeTime } from "@/lib/date";
import { Routes } from "@/routes/routes";

interface ProjectTableProps {
  projects: ResearchProject[];
  onDelete: (project: ResearchProject) => void;
}

export const ProjectTable: FC<ProjectTableProps> = ({ projects, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Posts</TableHead>
          <TableHead>Comments</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="max-w-64 truncate font-medium">{project.name}</TableCell>
            <TableCell className="text-muted-foreground">{project.source?.community ? `r/${project.source.community}` : "—"}</TableCell>
            <TableCell>{project.posts_analyzed}</TableCell>
            <TableCell>{project.comments_analyzed || "collecting"}</TableCell>
            <TableCell>
              <AnalysisStatusBadge status={project.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{formatRelativeTime(project.updated_at)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                <Button size="sm" variant="outline" asChild>
                  <Link to={Routes.dashboard.project(project.id)}>Open</Link>
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onDelete(project)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
