import type { FC } from "react";
import { Link } from "react-router-dom";
import { Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SourceCard } from "@/components/ui/source-card";
import type { Post } from "@/features/posts/interfaces/posts.interfaces";
import type { ResearchProject } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { Routes } from "@/routes/routes";

interface SourcesTabProps {
  project: ResearchProject;
  previewPosts: Post[];
}

export const SourcesTab: FC<SourcesTabProps> = ({ project, previewPosts }) => {
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div>
            <p className="text-sm font-semibold">{project.comments_analyzed.toLocaleString()} comments back this report</p>
            <p className="text-sm text-muted-foreground">Every claim traces back to a specific post or comment.</p>
          </div>
          <Button asChild>
            <Link to={Routes.dashboard.project_sources(project.id)}>
              <Library className="h-4 w-4" />
              Open source library
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {previewPosts.slice(0, 4).map((post) => (
          <SourceCard
            key={post.id}
            kind="post"
            id={post.id}
            community={post.community}
            author={post.author}
            score={post.score}
            postedAt={post.posted_at}
            permalink={post.permalink}
            title={post.title}
            excerpt={post.body ?? post.title}
            preloadedPost={post}
          />
        ))}
      </div>
    </div>
  );
};
