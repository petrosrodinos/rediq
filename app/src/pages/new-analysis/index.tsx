import { useEffect, useMemo, type FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DetectedSourceCard } from "./components/detected-source-card";
import { CollectionSettingsCard } from "./components/collection-settings-card";
import { AdvancedFiltersCard } from "./components/advanced-filters-card";
import { newAnalysisDefaultValues, newAnalysisSchema, type NewAnalysisFormValues } from "./validation-schemas/new-analysis.schema";
import { suggestAnalysisName } from "./utils/reddit-url.utils";
import { useCreateResearchProject } from "@/features/research-projects/hooks/use-research-projects";
import { useCreateAnalysisJob } from "@/features/analysis-jobs/hooks/use-analysis-jobs";
import { getAnalysisConfigurations } from "@/features/analysis-configurations/services/analysis-configurations.services";
import { Routes } from "@/routes/routes";
import { toast } from "@/hooks/use-toast";

const QUICK_FILLS = ["https://reddit.com/r/vandwellers", "https://reddit.com/r/bookkeeping"];

const NewAnalysisPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm<NewAnalysisFormValues>({
    resolver: zodResolver(newAnalysisSchema),
    defaultValues: { ...newAnalysisDefaultValues, url: searchParams.get("url") ?? "" },
  });

  const url = form.watch("url");
  const maxPosts = form.watch("max_posts");
  const maxCommentsPerPost = form.watch("max_comments_per_post");
  const maxComments = form.watch("max_comments");
  const processingMode = form.watch("processing_mode");

  useEffect(() => {
    const prefilledUrl = searchParams.get("url");
    if (prefilledUrl && !form.getValues("name")) {
      form.setValue("name", suggestAnalysisName(prefilledUrl));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createProject = useCreateResearchProject();
  const createJob = useCreateAnalysisJob();

  const estimate = useMemo(() => {
    const comments = Math.min(maxPosts * maxCommentsPerPost, maxComments || Infinity);
    const minMinutes = Math.max(2, Math.round(comments / 1800));
    const maxMinutes = minMinutes + 3;
    return { comments: Math.round(comments), minMinutes, maxMinutes };
  }, [maxPosts, maxCommentsPerPost, maxComments]);

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

      const job = await createJob.mutateAsync({ researchProjectId: project.id, dto: { analysis_configuration_uuid: configurationId } });
      navigate(Routes.dashboard.analysis_job(job.id));
    } catch (error) {
      toast({
        title: "Could not start the analysis",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "error",
      });
    }
  };

  const isSubmitting = createProject.isPending || createJob.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-[900px] space-y-5">
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

            <DetectedSourceCard url={url} />
          </CardContent>
        </Card>

        <CollectionSettingsCard control={form.control} processingMode={processingMode} />
        <AdvancedFiltersCard control={form.control} />

        <Card className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[11px] text-muted-foreground">Estimated scope</div>
              <div className="mt-0.5 font-mono text-[15px] font-semibold">
                about {estimate.comments.toLocaleString()} comments ·{" "}
                {processingMode === "BATCH" ? "runs in the background" : `${estimate.minMinutes}–${estimate.maxMinutes} min`}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => navigate(Routes.dashboard.root)}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Start analysis
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default NewAnalysisPage;
