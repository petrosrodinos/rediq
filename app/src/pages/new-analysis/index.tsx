import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DetectedSourceCard } from "./components/detected-source-card";
import { CollectionSettingsCard } from "./components/collection-settings-card";
import { AdvancedFiltersCard } from "./components/advanced-filters-card";
import { newAnalysisDefaultValues, newAnalysisSchema, type NewAnalysisFormValues } from "./validation-schemas/new-analysis.schema";
import { suggestAnalysisName, parseRedditUrl } from "./utils/reddit-url.utils";
import { useCreateResearchProject, useDetectResearchSource } from "@/features/research-projects/hooks/use-research-projects";
import { useCreateAnalysisJob } from "@/features/analysis-jobs/hooks/use-analysis-jobs";
import { getAnalysisConfigurations } from "@/features/analysis-configurations/services/analysis-configurations.services";
import { Routes } from "@/routes/routes";
import { toast } from "@/hooks/use-toast";
import { SourceType, type SourceTypeType } from "@/features/research-projects/interfaces/research-projects.interfaces";

const QUICK_FILLS = ["https://reddit.com/r/vandwellers", "https://reddit.com/r/bookkeeping"];

const NewAnalysisPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm<NewAnalysisFormValues>({
    resolver: zodResolver(newAnalysisSchema),
    defaultValues: { ...newAnalysisDefaultValues, url: searchParams.get("url") ?? "" },
  });

  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const url = form.watch("url");
  const maxPosts = form.watch("max_posts");
  const maxCommentsPerPost = form.watch("max_comments_per_post");
  const maxComments = form.watch("max_comments");
  const sortOrder = form.watch("sort_order");
  const processingMode = form.watch("processing_mode");

  const detectSource = useDetectResearchSource();
  const lastDetectedUrlRef = useRef<string | null>(null);

  // Detection is a real, billed Apify request. Only clear a stale result
  // when the URL changes underneath it (so filters never stay scoped to a
  // URL no longer in the box) — never re-fetch automatically. Fetching only
  // ever happens from the "Detect source" button inside DetectedSourceCard.
  useEffect(() => {
    if (lastDetectedUrlRef.current !== url) {
      lastDetectedUrlRef.current = url;
      detectSource.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Whether a URL points at a subreddit or one specific post is fully
  // knowable from its syntax alone (a `/comments/` segment) — free, instant,
  // no Apify call. Filters must react to THIS, not to the paid detect
  // result, so they're correct the instant a URL is pasted. Once a real
  // detection succeeds, prefer its (authoritative, confirmed-public) value;
  // otherwise fall back to the structural guess.
  const structuralSourceType = useMemo<SourceTypeType | null>(() => {
    const { community, isThread } = parseRedditUrl(url);
    if (!community) return null;
    return isThread ? SourceType.THREAD : SourceType.COMMUNITY;
  }, [url]);

  const sourceType = detectSource.data?.is_public ? detectSource.data.source_type : structuralSourceType;

  useEffect(() => {
    const prefilledUrl = searchParams.get("url");
    if (prefilledUrl && !form.getValues("name")) {
      form.setValue("name", suggestAnalysisName(prefilledUrl));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createProject = useCreateResearchProject();
  const createJob = useCreateAnalysisJob();

  // Pure client-side math over data already in hand (the one detect-source
  // result, plus the chosen filters) — no additional Apify request. A
  // subreddit has no exact total available without scraping it in full, so
  // that case is explicitly labeled as an upper-bound estimate, not a fact.
  const reviewSummary = useMemo(() => {
    if (!detectSource.data?.is_public || !sourceType) return null;

    if (sourceType === SourceType.THREAD) {
      const detected = detectSource.data.comment_count;
      const cap = maxComments;
      return {
        headline:
          typeof detected === "number"
            ? `Up to ${Math.min(detected, cap).toLocaleString()} of this thread's ${detected.toLocaleString()} comments`
            : `Up to ${cap.toLocaleString()} comments`,
        note: null as string | null,
      };
    }

    const upperBound = Math.min(maxPosts * maxCommentsPerPost, maxComments);
    return {
      headline: `Up to ${maxPosts.toLocaleString()} posts (sorted by ${sortOrder.toLowerCase()}), ~${upperBound.toLocaleString()} comments at most`,
      note: `Estimate only — actual volume depends on how active r/${detectSource.data.community} is.`,
    };
  }, [detectSource.data, sourceType, maxPosts, maxCommentsPerPost, maxComments, sortOrder]);

  const onSubmit = async (values: NewAnalysisFormValues) => {
    try {
      const project = await createProject.mutateAsync({
        name: values.name,
        url: values.url,
        configuration: {
          processing_mode: values.processing_mode,
          sort_order: values.sort_order,
          top_time_range: values.top_time_range,
          max_posts: values.max_posts,
          max_comments_per_post: values.max_comments_per_post,
          max_comments: values.max_comments,
          max_comment_depth: values.max_comment_depth,
          min_post_score: values.min_post_score,
          min_comment_score: values.min_comment_score,
          include_replies: values.include_replies,
          include_nsfw: values.include_nsfw,
          include_controversial: values.include_controversial,
          analyze_deleted_when_unavailable: values.analyze_deleted_when_unavailable,
          prioritize_engagement: values.prioritize_engagement,
          prioritize_recent: values.prioritize_recent,
          prioritize_popular: values.prioritize_popular,
          prioritize_top_comments: values.prioritize_top_comments,
          analyze_entire_discussion: values.analyze_entire_discussion,
        },
      });

      let configurationId = project.analysis_configurations?.[0]?.id;
      if (!configurationId) {
        const configurations = await getAnalysisConfigurations(project.id, { limit: 1 });
        configurationId = configurations.data[0]?.id;
      }
      if (!configurationId) {
        throw new Error("Could not find the analysis configuration for this project.");
      }

      await createJob.mutateAsync({ researchProjectId: project.id, dto: { analysis_configuration_uuid: configurationId } });
      setConfirmOpen(false);
      navigate(Routes.dashboard.project(project.id));
    } catch (error) {
      toast({
        title: "Could not start the analysis",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "error",
      });
    }
  };

  const isSubmitting = createProject.isPending || createJob.isPending;

  const handleReviewClick = async () => {
    if (!parseRedditUrl(form.getValues("url")).community) {
      toast({ title: "Add a Reddit URL first", variant: "error" });
      return;
    }
    if (!detectSource.data?.is_public) {
      toast({
        title: "Detect the source first",
        description: 'Click "Detect source" above to confirm this URL is reachable before starting.',
        variant: "error",
      });
      return;
    }
    const valid = await form.trigger();
    if (valid) setConfirmOpen(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-[900px] space-y-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">New analysis</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Point Threadline at a thread or a subreddit. It reads what is there and builds a cited report.
          </p>
        </div>

        <Card className="rounded-[20px]">
          <CardContent className="space-y-3 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name this analysis</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Invoicing pain points in small business threads" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reddit URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://reddit.com/r/smallbusiness"
                      spellCheck={false}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!form.getValues("name")) {
                          form.setValue("name", suggestAnalysisName(e.target.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2">
              {QUICK_FILLS.map((example) => (
                <Button
                  key={example}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    form.setValue("url", example);
                    form.setValue("name", suggestAnalysisName(example));
                  }}
                >
                  {example.replace("https://reddit.com", "")}
                </Button>
              ))}
            </div>

            <DetectedSourceCard
              url={url}
              result={detectSource.data}
              isPending={detectSource.isPending}
              onDetect={() => detectSource.mutate(url)}
            />
          </CardContent>
        </Card>

        <CollectionSettingsCard control={form.control} processingMode={processingMode} sourceType={sourceType} />
        <AdvancedFiltersCard control={form.control} sourceType={sourceType} />

        <Card className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-muted-foreground">
              Review the detected source and your filters before this creates the project and starts collection.
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => navigate(Routes.dashboard.root)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleReviewClick}>
                Review &amp; start
              </Button>
            </div>
          </div>
        </Card>
      </form>

      <Dialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review before starting</DialogTitle>
            <DialogDescription>This creates the research project and starts the real collection job.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="font-semibold">{detectSource.data?.title || `r/${detectSource.data?.community}`}</div>
              <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                {sourceType === SourceType.THREAD ? "Thread" : "Subreddit"} · r/{detectSource.data?.community}
              </div>
            </div>

            {reviewSummary && (
              <div>
                <div className="font-medium">{reviewSummary.headline}</div>
                {reviewSummary.note && <p className="mt-1 text-xs text-muted-foreground">{reviewSummary.note}</p>}
              </div>
            )}

            <div className="font-mono text-[11px] text-muted-foreground">
              Processing mode: {processingMode === "BATCH" ? "Batch (background, lower cost)" : "Standard"}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} disabled={isSubmitting}>
              Back to edit
            </Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit)} loading={isSubmitting}>
              Start analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default NewAnalysisPage;
