import { z } from "zod";
import { ProcessingMode, PostSortOrder, TopTimeRange } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";

export const newAnalysisSchema = z.object({
    name: z.string().min(1, "Give this analysis a name"),
    url: z.string().min(1, "Paste a Reddit URL").url("Enter a valid URL, e.g. https://reddit.com/r/smallbusiness"),
    max_posts: z.number().min(10).max(500),
    max_comments_per_post: z.number().min(5).max(200),
    sort_order: z.enum([PostSortOrder.HOT, PostSortOrder.TOP, PostSortOrder.NEW, PostSortOrder.RISING, PostSortOrder.CONTROVERSIAL]),
    top_time_range: z.enum([TopTimeRange.HOUR, TopTimeRange.DAY, TopTimeRange.WEEK, TopTimeRange.MONTH, TopTimeRange.YEAR, TopTimeRange.ALL]),
    min_comment_score: z.number().min(0),
    min_post_score: z.number().min(0),
    processing_mode: z.enum([ProcessingMode.STANDARD, ProcessingMode.BATCH]),
    max_comments: z.number().min(0),
    max_comment_depth: z.number().min(1),
    include_replies: z.boolean(),
    include_controversial: z.boolean(),
    include_nsfw: z.boolean(),
    analyze_deleted_when_unavailable: z.boolean(),
    prioritize_top_comments: z.boolean(),
    analyze_entire_discussion: z.boolean(),
    prioritize_engagement: z.boolean(),
    prioritize_recent: z.boolean(),
    prioritize_popular: z.boolean(),
});

export type NewAnalysisFormValues = z.infer<typeof newAnalysisSchema>;

export const newAnalysisDefaultValues: NewAnalysisFormValues = {
    name: "",
    url: "",
    max_posts: 200,
    max_comments_per_post: 60,
    sort_order: PostSortOrder.HOT,
    top_time_range: TopTimeRange.MONTH,
    min_comment_score: 5,
    min_post_score: 10,
    processing_mode: ProcessingMode.STANDARD,
    max_comments: 12000,
    max_comment_depth: 6,
    include_replies: true,
    include_controversial: true,
    include_nsfw: false,
    analyze_deleted_when_unavailable: false,
    prioritize_top_comments: true,
    analyze_entire_discussion: false,
    prioritize_engagement: false,
    prioritize_recent: false,
    prioritize_popular: false,
};
