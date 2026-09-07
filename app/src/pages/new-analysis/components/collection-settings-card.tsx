import type { FC } from "react";
import type { Control } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PostSortOrderFormOptions } from "@/config/constants/dropdowns/research-projects/post-sort-order-form.options";
import { TopTimeRangeFormOptions } from "@/config/constants/dropdowns/research-projects/top-time-range-form.options";
import { ProcessingModeFormOptions, getProcessingModeDescription } from "@/config/constants/dropdowns/research-projects/processing-mode-form.options";
import type { NewAnalysisFormValues } from "../validation-schemas/new-analysis.schema";

interface CollectionSettingsCardProps {
  control: Control<NewAnalysisFormValues>;
  processingMode: NewAnalysisFormValues["processing_mode"];
}

export const CollectionSettingsCard: FC<CollectionSettingsCardProps> = ({ control, processingMode }) => {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-[15px] font-semibold">Collection settings</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Wider collection means better coverage and a longer run.</p>

      <CardContent className="grid gap-5 p-0 pt-5 sm:grid-cols-2">
        <FormField
          control={control}
          name="max_posts"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-baseline justify-between">
                <FormLabel>Posts to collect</FormLabel>
                <span className="font-mono text-xs">{field.value}</span>
              </div>
              <FormControl>
                <Slider min={10} max={500} step={10} value={[field.value]} onValueChange={([v]) => field.onChange(v)} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="max_comments_per_post"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-baseline justify-between">
                <FormLabel>Comments per post</FormLabel>
                <span className="font-mono text-xs">{field.value}</span>
              </div>
              <FormControl>
                <Slider min={5} max={200} step={5} value={[field.value]} onValueChange={([v]) => field.onChange(v)} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="sort_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sort posts by</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PostSortOrderFormOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="top_time_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time range (for Top)</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TopTimeRangeFormOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="min_comment_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum comment score</FormLabel>
              <FormControl>
                <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <p className="font-mono text-[11px] text-muted-foreground">Skips low signal replies</p>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="min_post_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum post score</FormLabel>
              <FormControl>
                <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>

      <div className="mt-5 border-t border-border pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[13px] font-medium">Processing mode</div>
            <p className="mt-0.5 text-xs text-muted-foreground">Batch costs half as much and runs in the background.</p>
          </div>
          <FormField
            control={control}
            name="processing_mode"
            render={({ field }) => (
              <ToggleGroup type="single" variant="outline" value={field.value} onValueChange={(v) => v && field.onChange(v)}>
                {ProcessingModeFormOptions.map((option) => (
                  <ToggleGroupItem key={option.id} value={option.id}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          />
        </div>
        <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3 font-mono text-[11px] text-muted-foreground">
          {getProcessingModeDescription(processingMode)}
        </div>
      </div>
    </Card>
  );
};
