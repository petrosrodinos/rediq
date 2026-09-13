import type { FC } from "react";
import type { Control } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SourceType, type SourceTypeType } from "@/features/research-projects/interfaces/research-projects.interfaces";
import type { NewAnalysisFormValues } from "../validation-schemas/new-analysis.schema";

interface AdvancedFiltersCardProps {
  control: Control<NewAnalysisFormValues>;
  sourceType?: SourceTypeType | null;
}

// `communityOnly` is verified against actual backend usage, not guessed:
// - `include_replies`/`include_nsfw`: confirmed unused for a thread in
//   `RedditIngestionService.ingest()` — a thread's comments are always
//   fetched directly regardless of either flag.
// - `prioritize_engagement`: `rankByValue` in `analysis.processor.ts` only
//   applies its `num_comments`-based bonus to posts (comments have no
//   `num_comments`), and ranking a single-post array is a no-op — so it has
//   no effect in thread mode.
// `prioritize_recent`/`prioritize_popular` are deliberately NOT
// community-only: `analysis.processor.ts` runs `rankByValue` over ranked
// *comments* too (using `posted_at`/`score`, which comments also have), and
// with only `MAX_CHUNKS_FOR_EXTRACTION` (400) chunks surviving, that order
// decides which of a large thread's comments actually get analyzed.
// `include_controversial`/`analyze_entire_discussion` are stored on
// AnalysisConfiguration but not read anywhere in the pipeline yet (dead in
// both modes) — left visible/shared until they're wired up.
const CHECKBOXES: { name: keyof NewAnalysisFormValues; label: string; communityOnly?: boolean }[] = [
  { name: "include_replies", label: "Include replies / nested comments", communityOnly: true },
  { name: "include_controversial", label: "Include controversial posts", communityOnly: true },
  { name: "include_nsfw", label: "Include NSFW content", communityOnly: true },
  { name: "analyze_deleted_when_unavailable", label: "Analyze deleted/removed content when unavailable" },
  { name: "prioritize_top_comments", label: "Prioritize top comments" },
  { name: "analyze_entire_discussion", label: "Analyze the entire discussion" },
  { name: "prioritize_engagement", label: "Prioritize highly engaged discussions", communityOnly: true },
  { name: "prioritize_recent", label: "Prioritize recent content" },
  { name: "prioritize_popular", label: "Prioritize popular content" },
];

export const AdvancedFiltersCard: FC<AdvancedFiltersCardProps> = ({ control, sourceType }) => {
  const isThread = sourceType === SourceType.THREAD;
  const visibleCheckboxes = CHECKBOXES.filter((checkbox) => !checkbox.communityOnly || !isThread);

  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-[15px] font-semibold">Advanced filters</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Fine tune what gets pulled in before analysis starts.</p>

      <CardContent className="grid gap-4 p-0 pt-5 sm:grid-cols-2">
        {isThread && (
          <FormField
            control={control}
            name="max_comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max comments overall</FormLabel>
                <FormControl>
                  <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={control}
          name="max_comment_depth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max comment depth</FormLabel>
              <FormControl>
                <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>

      <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {visibleCheckboxes.map(({ name, label }) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-[13px]">
                <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                {label}
              </label>
            )}
          />
        ))}
      </div>
    </Card>
  );
};
