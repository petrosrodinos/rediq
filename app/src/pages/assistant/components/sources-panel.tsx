import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CitationChip } from "@/components/ui/citation-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { FileSearch } from "lucide-react";
import type { MessageCitation } from "@/features/conversations/interfaces/conversations.interfaces";

interface SourcesPanelProps {
  citations: MessageCitation[];
}

export const SourcesPanel: FC<SourcesPanelProps> = ({ citations }) => {
  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[15px]">Sources in this answer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {citations.length === 0 ? (
            <EmptyState
              className="border-0 py-6"
              icon={<FileSearch className="h-5 w-5" />}
              title="No matching evidence yet"
              description="Ask a question grounded in your project to see citations here."
            />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {citations.map((citation, index) => (
                <CitationChip
                  key={citation.id}
                  index={index + 1}
                  postUuid={citation.post_uuid}
                  commentUuid={citation.comment_uuid}
                  excerpt={citation.excerpt}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Grounding.</span> In grounded mode, every answer is built only from
          comments inside this project — nothing is invented. Switching to external knowledge lets the assistant reason beyond
          your evidence, and it labels which parts aren't sourced from your project.
        </p>
      </Card>
    </div>
  );
};
