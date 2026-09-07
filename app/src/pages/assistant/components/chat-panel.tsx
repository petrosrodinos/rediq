import { useEffect, useRef, useState, type FC } from "react";
import { Bot, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MessageBubble } from "./message-bubble";
import { ConversationModes, type ConversationMessage, type ConversationMode } from "@/features/conversations/interfaces/conversations.interfaces";
import { formatCompactNumber } from "@/lib/format-number";

const SUGGESTED_QUESTIONS = ["Which tool gets recommended to solo freelancers?", "What breaks during migration?"];

interface ChatPanelProps {
  projectName?: string;
  commentsAnalyzed?: number;
  mode: ConversationMode;
  onModeChange: (mode: ConversationMode) => void;
  messages: ConversationMessage[];
  isLoadingMessages: boolean;
  isSending: boolean;
  onSend: (content: string) => void;
  onNewChat: () => void;
}

export const ChatPanel: FC<ChatPanelProps> = ({
  projectName,
  commentsAnalyzed,
  mode,
  onModeChange,
  messages,
  isLoadingMessages,
  isSending,
  onSend,
  onNewChat,
}) => {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isSending]);

  const submit = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setDraft("");
  };

  return (
    <Card className="flex min-h-[600px] flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-flame text-white">
          <Bot className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">Assistant</div>
          <div className="truncate font-mono text-[11px] text-muted-foreground">
            {mode === ConversationModes.GROUNDED
              ? `Grounded in ${projectName ?? "this project"}${typeof commentsAnalyzed === "number" ? ` · ${formatCompactNumber(commentsAnalyzed)} comments` : ""}`
              : "External knowledge allowed · answers are labelled by source"}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ToggleGroup type="single" variant="outline" size="sm" value={mode} onValueChange={(v) => v && onModeChange(v as ConversationMode)}>
            <ToggleGroupItem value={ConversationModes.GROUNDED}>Grounded only</ToggleGroupItem>
            <ToggleGroupItem value={ConversationModes.EXTERNAL_ALLOWED}>Allow external</ToggleGroupItem>
          </ToggleGroup>
          <Button variant="ghost" size="sm" onClick={onNewChat}>
            New chat
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {isLoadingMessages ? (
          <div className="space-y-3">
            <Skeleton className="ml-auto h-10 w-2/3" />
            <Skeleton className="h-16 w-3/4" />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            className="border-0"
            icon={<Bot className="h-5 w-5" />}
            title="Ask about your evidence"
            description="The assistant only answers from comments inside your project, with citations attached."
          />
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        {isSending ? <p className="font-mono text-xs text-muted-foreground">Searching your comments…</p> : null}
      </div>

      <div className="space-y-2.5 border-t border-border p-4">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => submit(question)}
              className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-flame/40 hover:text-foreground"
            >
              {question}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit(draft);
            }}
            placeholder="Ask a question about this project's evidence…"
          />
          <Button onClick={() => submit(draft)} loading={isSending}>
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">Answers are generated from your collected comments and may be incomplete.</p>
      </div>
    </Card>
  );
};
