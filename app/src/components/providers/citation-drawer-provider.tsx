import { createContext, useCallback, useContext, useMemo, useState, type FC, type ReactNode } from "react";
import { ExternalLink, Copy } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPost } from "@/features/posts/hooks/use-posts";
import { useGetComment } from "@/features/comments/hooks/use-comments";
import { formatRelativeTime } from "@/lib/date";
import { formatScoreLabel } from "@/lib/format-number";
import { toast } from "@/hooks/use-toast";

export interface CitationPostLike {
  id: string;
  community: string;
  title: string;
  author?: string | null;
  body?: string | null;
  score: number;
  permalink: string;
  posted_at: string;
  flair?: string | null;
}

export interface CitationCommentLike {
  id: string;
  post_uuid: string;
  author?: string | null;
  body?: string | null;
  score: number;
  permalink: string;
  posted_at: string;
}

export interface CitationSource {
  postUuid?: string | null;
  commentUuid?: string | null;
  excerpt?: string | null;
  post?: CitationPostLike | null;
  comment?: CitationCommentLike | null;
  usedIn?: string | null;
}

interface CitationDrawerContextValue {
  open: (source: CitationSource) => void;
  close: () => void;
}

const CitationDrawerContext = createContext<CitationDrawerContextValue | null>(null);

export const useCitationDrawer = (): CitationDrawerContextValue => {
  const context = useContext(CitationDrawerContext);
  if (!context) {
    throw new Error("useCitationDrawer must be used within a CitationDrawerProvider.");
  }
  return context;
};

const REDDIT_BASE_URL = "https://reddit.com";

const CitationDrawerBody: FC<{ source: CitationSource }> = ({ source }) => {
  const shouldFetchPost = !!source.postUuid && !source.post;
  const shouldFetchComment = !!source.commentUuid && !source.comment;

  const fetchedPost = useGetPost(shouldFetchPost ? source.postUuid! : "");
  const fetchedComment = useGetComment(shouldFetchComment ? source.commentUuid! : "");

  const post = source.post ?? (shouldFetchPost ? fetchedPost.data : undefined);
  const comment = source.comment ?? (shouldFetchComment ? fetchedComment.data : undefined);

  const parentPostId = comment?.post_uuid ?? null;
  const shouldFetchParentPost = !!comment && !post && !!parentPostId;
  const parentPost = useGetPost(shouldFetchParentPost ? parentPostId! : "");

  const isLoading = (shouldFetchPost && fetchedPost.isLoading) || (shouldFetchComment && fetchedComment.isLoading);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  const kind = comment ? "Reddit comment" : "Reddit post";
  const community = post?.community ?? parentPost.data?.community;
  const author = comment?.author ?? post?.author;
  const score = comment?.score ?? post?.score;
  const postedAt = comment?.posted_at ?? post?.posted_at;
  const permalink = comment?.permalink ?? post?.permalink;
  const threadTitle = post?.title ?? parentPost.data?.title;
  const body = source.excerpt ?? comment?.body ?? post?.body;
  const initials = (author ?? "u")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline">{kind}</Badge>
        {community ? <Badge variant="secondary">r/{community}</Badge> : null}
        {typeof score === "number" ? (
          <Badge variant="outline" className="font-mono text-flame">
            {formatScoreLabel(score)}
          </Badge>
        ) : null}
        {postedAt ? <Badge variant="outline">{formatRelativeTime(postedAt)}</Badge> : null}
      </div>

      {threadTitle ? <p className="text-sm font-semibold leading-snug">{threadTitle}</p> : null}

      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-semibold text-accent-foreground">
          {initials}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="truncate text-xs font-medium text-muted-foreground">u/{author ?? "unknown"}</p>
          <p className="relative border-l-2 border-primary/70 pl-3 text-sm leading-relaxed text-foreground">{body ?? "No excerpt available."}</p>
        </div>
      </div>

      {source.usedIn ? <p className="text-xs text-muted-foreground">Used in: {source.usedIn}</p> : null}

      <SheetFooter className="gap-2 sm:justify-start">
        {permalink ? (
          <Button variant="secondary" size="sm" asChild>
            <a href={`${REDDIT_BASE_URL}${permalink}`} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              View on Reddit
            </a>
          </Button>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void navigator.clipboard.writeText(body ?? "");
            toast({ title: "Copied to clipboard", duration: 1500 });
          }}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
      </SheetFooter>
    </div>
  );
};

export const CitationDrawerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [source, setSource] = useState<CitationSource | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((next: CitationSource) => {
    setSource(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <CitationDrawerContext.Provider value={value}>
      {children}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Source</SheetTitle>
            <SheetDescription>Where this claim comes from, exactly as it was posted.</SheetDescription>
          </SheetHeader>
          <div className="mt-4">{source ? <CitationDrawerBody source={source} /> : null}</div>
        </SheetContent>
      </Sheet>
    </CitationDrawerContext.Provider>
  );
};
