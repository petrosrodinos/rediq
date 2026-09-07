import type { FC } from "react";
import type { Control } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { NewAnalysisFormValues } from "../validation-schemas/new-analysis.schema";

interface AdvancedFiltersCardProps {
  control: Control<NewAnalysisFormValues>;
}

const CHECKBOXES: { name: keyof NewAnalysisFormValues; label: string }[] = [
  { name: "include_replies", label: "Include replies / nested comments" },
  { name: "include_controversial", label: "Include controversial posts" },
  { name: "include_nsfw", label: "Include NSFW content" },
  { name: "analyze_deleted_when_unavailable", label: "Analyze deleted/removed content when unavailable" },
  { name: "prioritize_top_comments", label: "Prioritize top comments" },
  { name: "analyze_entire_discussion", label: "Analyze the entire discussion" },
  { name: "prioritize_engagement", label: "Prioritize highly engaged discussions" },
  { name: "prioritize_recent", label: "Prioritize recent content" },
  { name: "prioritize_popular", label: "Prioritize popular content" },
];

export const AdvancedFiltersCard: FC<AdvancedFiltersCardProps> = ({ control }) => {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-[15px] font-semibold">Advanced filters</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Fine tune what gets pulled in before analysis starts.</p>

      <CardContent className="grid gap-4 p-0 pt-5 sm:grid-cols-2">
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
        {CHECKBOXES.map(({ name, label }) => (
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
