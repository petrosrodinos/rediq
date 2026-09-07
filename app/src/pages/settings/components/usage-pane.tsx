import type { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import { useGetResearchProjects } from "@/features/research-projects/hooks/use-research-projects";

export const UsagePane: FC = () => {
  const projects = useGetResearchProjects({ limit: 100, order_by: "created_at", order_direction: "desc" });
  const allProjects = projects.data?.data ?? [];

  const now = new Date();
  const analysesThisMonth = allProjects.filter((project) => {
    const createdAt = new Date(project.created_at);
    return createdAt.getFullYear() === now.getFullYear() && createdAt.getMonth() === now.getMonth();
  }).length;

  const commentsProcessed = allProjects.reduce((total, project) => total + project.comments_analyzed, 0);
  const postsAnalyzed = allProjects.reduce((total, project) => total + project.posts_analyzed, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Usage</CardTitle>
        <CardDescription>Real totals across every research project on your account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <StatTile label="Analyses this month" value={analysesThisMonth} isLoading={projects.isLoading} />
        <StatTile label="Comments processed" value={commentsProcessed.toLocaleString()} isLoading={projects.isLoading} />
        <StatTile label="Posts analyzed" value={postsAnalyzed.toLocaleString()} isLoading={projects.isLoading} />
      </CardContent>
    </Card>
  );
};
