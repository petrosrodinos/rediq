import type { FC } from "react";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CitationChip } from "@/components/ui/citation-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InsightType, SentimentLabel, type KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";
import { byType } from "../../utils/insight-grouping.utils";
import { getSentimentLabel } from "@/config/constants/dropdowns/knowledge-insights/sentiment-label-form.options";

interface ProductsTabProps {
  insights: KnowledgeInsight[];
}

const sentimentBadgeClass: Record<string, string> = {
  [SentimentLabel.POSITIVE]: "border-moss/30 bg-moss-soft text-moss",
  [SentimentLabel.NEUTRAL]: "border-border bg-muted text-muted-foreground",
  [SentimentLabel.NEGATIVE]: "border-rose/25 bg-rose-soft text-rose",
};

export const ProductsTab: FC<ProductsTabProps> = ({ insights }) => {
  const products = byType(insights, InsightType.PRODUCT_MENTION).sort((a, b) => b.supporting_count - a.supporting_count);

  if (!products.length) {
    return <EmptyState icon={<Package className="h-5 w-5" />} title="No products mentioned yet" />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Mentions</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Evidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((insight) => (
            <TableRow key={insight.id}>
              <TableCell className="font-medium">{insight.title}</TableCell>
              <TableCell className="font-mono">{insight.supporting_count}</TableCell>
              <TableCell>
                {insight.sentiment ? (
                  <Badge variant="outline" className={sentimentBadgeClass[insight.sentiment]}>
                    {getSentimentLabel(insight.sentiment)}
                  </Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="max-w-xs text-sm text-muted-foreground">{insight.content}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {insight.citations.slice(0, 2).map((citation) => (
                    <CitationChip key={citation.id} postUuid={citation.post_uuid} commentUuid={citation.comment_uuid} excerpt={citation.excerpt} />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
