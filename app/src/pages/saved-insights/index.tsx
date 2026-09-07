import { useState, type FC } from "react";
import { Bookmark, Copy, FolderOpen, Trash2 } from "lucide-react";
import { useGetSavedInsights, useGetSavedInsightCollections, useDeleteSavedInsight } from "@/features/saved-insights/hooks/use-saved-insights";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CitationChip } from "@/components/ui/citation-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { getInsightTypeLabel } from "@/config/constants/dropdowns/knowledge-insights/insight-type-form.options";
import { formatRelativeTime } from "@/lib/date";
import { Routes } from "@/routes/routes";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const PAGE_SIZE = 12;
const ALL_COLLECTIONS = "all";

const SavedInsightsPage: FC = () => {
  const [page, setPage] = useState(1);
  const [collectionId, setCollectionId] = useState<string>(ALL_COLLECTIONS);
  const [pendingUnsaveId, setPendingUnsaveId] = useState<string | null>(null);

  const collections = useGetSavedInsightCollections();
  const savedInsights = useGetSavedInsights({
    page,
    limit: PAGE_SIZE,
    collection_uuid: collectionId === ALL_COLLECTIONS ? undefined : collectionId,
  });
  const deleteSavedInsight = useDeleteSavedInsight();

  const collectionNameById = new Map((collections.data ?? []).map((collection) => [collection.id, collection.name]));

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Saved insights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {savedInsights.data?.pagination.total ?? 0} saved across every project.
          </p>
        </div>
        <Select
          value={collectionId}
          onValueChange={(value) => {
            setCollectionId(value);
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Filter by collection" className="w-56">
            <SelectValue placeholder="All collections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_COLLECTIONS}>All collections</SelectItem>
            {(collections.data ?? []).map((collection) => (
              <SelectItem key={collection.id} value={collection.id}>
                {collection.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {savedInsights.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      ) : !savedInsights.data?.data.length ? (
        <EmptyState
          icon={<Bookmark className="h-5 w-5" />}
          title="No saved insights yet"
          description="Open a report and save the claims worth coming back to."
          action={
            <Button asChild size="sm">
              <Link to={Routes.dashboard.research}>Open a report</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {savedInsights.data.data.map((saved) => {
              const insight = saved.knowledge_insight;
              const collectionName = saved.collection_uuid ? (collectionNameById.get(saved.collection_uuid) ?? "Collection") : "Uncategorized";

              return (
                <Card key={saved.id} className="flex flex-col rounded-2xl">
                  <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="secondary">{collectionName}</Badge>
                        <Badge variant="outline">{getInsightTypeLabel(insight.type)}</Badge>
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground">Saved {formatRelativeTime(saved.created_at)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => setPendingUnsaveId(saved.id)}
                      aria-label="Unsave insight"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-3">
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold leading-snug">{insight.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{insight.content}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {insight.citations.map((citation) => (
                        <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <Button variant="secondary" size="sm" asChild>
                        <Link to={Routes.dashboard.project(saved.research_project_uuid)}>
                          <FolderOpen className="h-3.5 w-3.5" />
                          Open project
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          void navigator.clipboard.writeText(insight.content);
                          toast({ title: "Copied to clipboard", duration: 1500 });
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Pagination
            currentPage={savedInsights.data.pagination.page}
            totalPages={savedInsights.data.pagination.total_pages}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmationDialog
        isOpen={!!pendingUnsaveId}
        onClose={() => setPendingUnsaveId(null)}
        onConfirm={() => {
          if (!pendingUnsaveId) return;
          deleteSavedInsight.mutate(pendingUnsaveId, { onSuccess: () => setPendingUnsaveId(null) });
        }}
        title="Remove from saved insights?"
        description="You can always save it again from the report."
        confirmText="Unsave"
        variant="destructive"
        isLoading={deleteSavedInsight.isPending}
      />
    </div>
  );
};

export default SavedInsightsPage;
