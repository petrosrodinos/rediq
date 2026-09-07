import { useMemo, useState, type FC } from "react";
import { Search as SearchIcon, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchResultCard } from "./components/search-result-card";
import { useSearchResearchProject } from "@/features/search/hooks/use-search";
import { useGetResearchProjects } from "@/features/research-projects/hooks/use-research-projects";
import { useCreateSavedSearch } from "@/features/saved-searches/hooks/use-saved-searches";
import { SemanticResultTypes, type SemanticSearchResult } from "@/features/search/interfaces/search.interfaces";
import type { TopTimeRangeType } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";
import { TopTimeRangeFilterOptions } from "@/config/constants/dropdowns/research-projects/top-time-range-filter.options";
import { ScoreFloorFilterOptions } from "@/config/constants/dropdowns/search/score-floor-filter.options";
import { getTimeRangeCutoff } from "./utils/time-range.utils";

const EXAMPLE_QUERIES = ["what made people switch tools", "biggest complaint about pricing", "what breaks during migration"];

const ALL_PROJECTS = "all";
const ANY_TIME: TopTimeRangeType | "all" = "all";

const SearchPage: FC = () => {
  const [query, setQuery] = useState("");
  const [projectScope, setProjectScope] = useState<string>(ALL_PROJECTS);
  const [scoreFloor, setScoreFloor] = useState<number>(0);
  const [timeRange, setTimeRange] = useState<TopTimeRangeType | "all">(ANY_TIME);

  const [results, setResults] = useState<SemanticSearchResult[] | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const projects = useGetResearchProjects({ limit: 100 });
  const search = useSearchResearchProject();
  const createSavedSearch = useCreateSavedSearch();

  const projectNameById = useMemo(() => new Map((projects.data?.data ?? []).map((project) => [project.id, project.name])), [projects.data]);

  const runSearch = async (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (!trimmed) return;

    setIsSearching(true);
    const start = performance.now();

    try {
      let combined: SemanticSearchResult[] = [];

      if (projectScope === ALL_PROJECTS) {
        const ids = (projects.data?.data ?? []).map((project) => project.id);
        const batches = await Promise.all(
          ids.map((id) => search.mutateAsync({ researchProjectId: id, dto: { query: trimmed, limit: 10 } }).catch(() => [])),
        );
        combined = batches.flat();
      } else {
        combined = await search.mutateAsync({ researchProjectId: projectScope, dto: { query: trimmed, limit: 30 } });
      }

      combined = combined.sort((a, b) => b.score - a.score).slice(0, 30);
      setElapsedMs(Math.round(performance.now() - start));
      setLastQuery(trimmed);
      setResults(combined);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!results) return [];
    const cutoff = getTimeRangeCutoff(timeRange === "all" ? null : timeRange);

    return results.filter((result) => {
      if (result.type !== SemanticResultTypes.POST && result.type !== SemanticResultTypes.COMMENT) return true;

      const source = (result.source ?? {}) as Record<string, unknown>;
      if (scoreFloor && typeof source.score === "number" && source.score < scoreFloor) return false;
      if (cutoff && typeof source.posted_at === "string" && new Date(source.posted_at) < cutoff) return false;
      return true;
    });
  }, [results, scoreFloor, timeRange]);

  const clearFilters = () => {
    setQuery("");
    setResults(null);
    setLastQuery("");
    setElapsedMs(null);
    setScoreFloor(0);
    setTimeRange(ANY_TIME);
    setProjectScope(ALL_PROJECTS);
  };

  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold">Search all evidence</h2>
        <p className="mt-1 text-sm text-muted-foreground">Semantic search across every comment and post you've collected.</p>
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="e.g. what made people switch accounting tools"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void runSearch(query);
              }}
              className="flex-1"
            />
            <Button onClick={() => void runSearch(query)} loading={isSearching}>
              <SearchIcon className="h-4 w-4" />
              Search
            </Button>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Select value={projectScope} onValueChange={setProjectScope}>
              <SelectTrigger aria-label="Project scope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_PROJECTS}>All projects</SelectItem>
                {(projects.data?.data ?? []).map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(scoreFloor)} onValueChange={(value) => setScoreFloor(Number(value))}>
              <SelectTrigger aria-label="Minimum score">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ScoreFloorFilterOptions.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TopTimeRangeType | "all")}>
              <SelectTrigger aria-label="Time range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TopTimeRangeFilterOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {EXAMPLE_QUERIES.map((example) => (
              <button
                key={example}
                type="button"
                className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-flame/40 hover:text-foreground"
                onClick={() => {
                  setQuery(example);
                  void runSearch(example);
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {!results ? (
        <EmptyState
          icon={<SearchIcon className="h-5 w-5" />}
          title="Search hasn't run yet"
          description="Ask a question in plain language — Threadline searches the meaning of every comment, not just keywords."
        />
      ) : isSearching ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredResults.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="h-5 w-5" />}
          title="No results for that search"
          description="Try a broader question, a different project scope, or clear your filters."
          action={
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredResults.length} result{filteredResults.length === 1 ? "" : "s"} in {elapsedMs}ms
            </span>
            <Button
              variant="ghost"
              size="sm"
              loading={createSavedSearch.isPending}
              onClick={() =>
                createSavedSearch.mutate({
                  query: lastQuery,
                  research_project_uuid: projectScope === ALL_PROJECTS ? null : projectScope,
                  min_score: scoreFloor || null,
                  time_range: timeRange === "all" ? null : timeRange,
                })
              }
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              Save this search
            </Button>
          </div>

          {filteredResults.map((result, index) => (
            <SearchResultCard
              key={`${result.type}-${result.id}-${index}`}
              result={result}
              projectName={
                projectScope === ALL_PROJECTS
                  ? projectNameById.get(String((result.source as Record<string, unknown> | null)?.research_project_uuid ?? ""))
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
