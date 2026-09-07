import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export type SourceSortBy = "relevance" | "score" | "newest";

interface SourcesFilterSidebarProps {
  includePosts: boolean;
  onIncludePostsChange: (value: boolean) => void;
  includeComments: boolean;
  onIncludeCommentsChange: (value: boolean) => void;
  topicId: string;
  onTopicChange: (value: string) => void;
  topicOptions: { id: string; label: string }[];
  flair: string;
  onFlairChange: (value: string) => void;
  flairOptions: string[];
  minScore: number;
  onMinScoreChange: (value: number) => void;
  sortBy: SourceSortBy;
  onSortByChange: (value: SourceSortBy) => void;
  onReset: () => void;
}

export const SourcesFilterSidebar: FC<SourcesFilterSidebarProps> = ({
  includePosts,
  onIncludePostsChange,
  includeComments,
  onIncludeCommentsChange,
  topicId,
  onTopicChange,
  topicOptions,
  flair,
  onFlairChange,
  flairOptions,
  minScore,
  onMinScoreChange,
  sortBy,
  onSortByChange,
  onReset,
}) => {
  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={includePosts} onCheckedChange={(checked) => onIncludePostsChange(checked === true)} />
            Posts
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={includeComments} onCheckedChange={(checked) => onIncludeCommentsChange(checked === true)} />
            Comments
          </label>
          <p className="font-mono text-[11px] text-muted-foreground">
            Comments are pulled from the posts shown here — there is no project-wide comment index yet.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sources-topic" className="text-xs text-muted-foreground">
            Topic
          </Label>
          <Select value={topicId} onValueChange={onTopicChange}>
            <SelectTrigger id="sources-topic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {topicOptions.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sources-flair" className="text-xs text-muted-foreground">
            Flair
          </Label>
          <Select value={flair} onValueChange={onFlairChange}>
            <SelectTrigger id="sources-flair">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All flairs</SelectItem>
              {flairOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Minimum score</Label>
            <span className="font-mono text-xs">{minScore} points</span>
          </div>
          <Slider value={[minScore]} min={0} max={500} step={10} onValueChange={(value) => onMinScoreChange(value[0] ?? 0)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sources-sort" className="text-xs text-muted-foreground">
            Sort by
          </Label>
          <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SourceSortBy)}>
            <SelectTrigger id="sources-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="score">Score</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
          Reset filters
        </Button>
      </CardContent>
    </Card>
  );
};
