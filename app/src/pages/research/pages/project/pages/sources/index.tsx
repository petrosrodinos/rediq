import { useEffect, useMemo, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Download, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SourceCard } from "@/components/ui/source-card";
import { SourcesFilterSidebar, type SourceSortBy } from "./components/sources-filter-sidebar";
import { SourceSkeletonCard } from "./components/source-skeleton-card";
import { useGetResearchProject } from "@/features/research-projects/hooks/use-research-projects";
import { useGetPosts } from "@/features/posts/hooks/use-posts";
import { useGetTopics } from "@/features/topics/hooks/use-topics";
import { getComments } from "@/features/comments/services/comments.services";
import { PostOrderByFields } from "@/features/posts/interfaces/posts.interfaces";
import type { Post } from "@/features/posts/interfaces/posts.interfaces";
import type { Comment } from "@/features/comments/interfaces/comments.interfaces";
import { CommentOrderByFields, CommentOrderDirections } from "@/features/comments/interfaces/comments.interfaces";
import { toast } from "@/hooks/use-toast";

const PAGE_SIZE = 12;
const COMMENTS_PER_POST = 5;

type FeedItem =
  | { kind: "post"; post: Post }
  | { kind: "comment"; comment: Comment; parentPost: Post };

const toCsvValue = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const downloadCsv = (posts: Post[]) => {
  const header = ["title", "author", "community", "score", "url", "posted_at"];
  const rows = posts.map((post) => [post.title, post.author ?? "", post.community, post.score, post.url, post.posted_at].map(toCsvValue).join(","));
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sources.csv";
  link.click();
  URL.revokeObjectURL(url);
};

const SourcesPage: FC = () => {
  const { projectId = "" } = useParams<{ projectId: string }>();

  const [includePosts, setIncludePosts] = useState(true);
  const [includeComments, setIncludeComments] = useState(true);
  const [topicId, setTopicId] = useState("all");
  const [flair, setFlair] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState<SourceSortBy>("relevance");
  const [page, setPage] = useState(1);
  const [accumulatedPosts, setAccumulatedPosts] = useState<Post[]>([]);

  const project = useGetResearchProject(projectId);
  const topics = useGetTopics(projectId);

  const posts = useGetPosts(projectId, {
    page,
    limit: PAGE_SIZE,
    min_score: minScore || undefined,
    order_by: sortBy === "score" ? PostOrderByFields.SCORE : sortBy === "newest" ? PostOrderByFields.POSTED_AT : undefined,
    order_direction: "desc",
  });

  const filterKey = `${minScore}-${sortBy}`;
  useEffect(() => {
    setPage(1);
    setAccumulatedPosts([]);
  }, [filterKey, projectId]);

  useEffect(() => {
    if (!posts.data?.data) return;
    setAccumulatedPosts((prev) => (page === 1 ? posts.data.data : [...prev, ...posts.data.data]));
  }, [posts.data, page]);

  const commentsQueries = useQueries({
    queries: (includeComments ? accumulatedPosts : []).map((post) => ({
      queryKey: ["comments", post.id, { limit: COMMENTS_PER_POST, min_score: minScore || undefined, order_by: CommentOrderByFields.SCORE, order_direction: CommentOrderDirections.DESC }],
      queryFn: () =>
        getComments(post.id, {
          limit: COMMENTS_PER_POST,
          min_score: minScore || undefined,
          order_by: CommentOrderByFields.SCORE,
          order_direction: CommentOrderDirections.DESC,
        }),
    })),
  });

  const flairOptions = useMemo(() => {
    const values = new Set<string>();
    accumulatedPosts.forEach((post) => {
      if (post.flair) values.add(post.flair);
    });
    return Array.from(values);
  }, [accumulatedPosts]);

  const feed = useMemo(() => {
    const postItems: FeedItem[] = includePosts
      ? accumulatedPosts.filter((post) => flair === "all" || post.flair === flair).map((post) => ({ kind: "post", post }))
      : [];

    const commentItems: FeedItem[] = includeComments
      ? commentsQueries.flatMap((query, index) => {
          const parentPost = accumulatedPosts[index];
          if (!parentPost || (flair !== "all" && parentPost.flair !== flair)) return [];
          return (query.data?.data ?? []).map((comment) => ({ kind: "comment" as const, comment, parentPost }));
        })
      : [];

    const combined = [...postItems, ...commentItems];

    if (sortBy === "score") {
      combined.sort((a, b) => (b.kind === "post" ? b.post.score : b.comment.score) - (a.kind === "post" ? a.post.score : a.comment.score));
    } else if (sortBy === "newest") {
      combined.sort((a, b) => {
        const dateA = a.kind === "post" ? a.post.posted_at : a.comment.posted_at;
        const dateB = b.kind === "post" ? b.post.posted_at : b.comment.posted_at;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    }

    return combined;
  }, [accumulatedPosts, commentsQueries, includePosts, includeComments, flair, sortBy]);

  const isInitialLoading = posts.isLoading && page === 1;
  const total = posts.data?.pagination.total ?? 0;

  const handleReset = () => {
    setIncludePosts(true);
    setIncludeComments(true);
    setTopicId("all");
    setFlair("all");
    setMinScore(0);
    setSortBy("relevance");
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sources</h1>
          <p className="text-sm text-muted-foreground">
            {project.data?.name ?? "Loading project…"} · r/{project.data?.source?.community} · {project.data?.posts_analyzed ?? 0} posts ·{" "}
            {project.data?.comments_analyzed ?? 0} comments
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            if (!accumulatedPosts.length) return;
            downloadCsv(accumulatedPosts);
            toast({ title: "Exported sources.csv", duration: 1500 });
          }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <SourcesFilterSidebar
          includePosts={includePosts}
          onIncludePostsChange={setIncludePosts}
          includeComments={includeComments}
          onIncludeCommentsChange={setIncludeComments}
          topicId={topicId}
          onTopicChange={setTopicId}
          topicOptions={(topics.data?.data ?? []).map((topic) => ({ id: topic.id, label: topic.name }))}
          flair={flair}
          onFlairChange={setFlair}
          flairOptions={flairOptions}
          minScore={minScore}
          onMinScoreChange={setMinScore}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onReset={handleReset}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {feed.length} of {total}
            </span>
            <Badge variant="outline" className="capitalize">
              {sortBy}
            </Badge>
          </div>

          {isInitialLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <SourceSkeletonCard key={index} />
              ))}
            </div>
          ) : !feed.length ? (
            <EmptyState icon={<Library className="h-5 w-5" />} title="No sources above that score" description="Lower the minimum score or reset your filters to see more of the report's evidence." />
          ) : (
            <div className="space-y-3">
              {feed.map((item) =>
                item.kind === "post" ? (
                  <SourceCard
                    key={`post-${item.post.id}`}
                    kind="post"
                    id={item.post.id}
                    community={item.post.community}
                    author={item.post.author}
                    score={item.post.score}
                    postedAt={item.post.posted_at}
                    permalink={item.post.permalink}
                    title={item.post.title}
                    excerpt={item.post.body ?? item.post.title}
                    topics={item.post.flair ? [item.post.flair] : undefined}
                    preloadedPost={item.post}
                  />
                ) : (
                  <SourceCard
                    key={`comment-${item.comment.id}`}
                    kind="comment"
                    id={item.comment.id}
                    community={item.parentPost.community}
                    author={item.comment.author}
                    score={item.comment.score}
                    postedAt={item.comment.posted_at}
                    permalink={item.comment.permalink}
                    title={item.parentPost.title}
                    excerpt={item.comment.body ?? ""}
                    preloadedComment={item.comment}
                  />
                ),
              )}
            </div>
          )}

          {posts.data?.pagination.has_next ? (
            <Button variant="outline" className="w-full" onClick={() => setPage((prev) => prev + 1)} loading={posts.isFetching && page > 1}>
              Load more
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SourcesPage;
