import type { FC } from "react";
import { Bot, Copy } from "lucide-react";
import { CitationChip } from "@/components/ui/citation-chip";
import { Button } from "@/components/ui/button";
import { MessageRoles, type ConversationMessage } from "@/features/conversations/interfaces/conversations.interfaces";
import { toast } from "@/hooks/use-toast";

interface MessageBubbleProps {
  message: ConversationMessage;
}

export const MessageBubble: FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRoles.USER;
  const citations = message.citations ?? [];

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-night px-4 py-2.5 text-sm text-white">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Bot className="h-4 w-4" />
      </div>
      <div className="min-w-0 max-w-[80%] space-y-2">
        <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-2.5 text-sm leading-relaxed">{message.content}</div>
        {citations.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
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
        ) : null}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{citations.length} source{citations.length === 1 ? "" : "s"}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto gap-1 p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              void navigator.clipboard.writeText(message.content);
              toast({ title: "Copied to clipboard", duration: 1500 });
            }}
          >
            <Copy className="h-3 w-3" />
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};
