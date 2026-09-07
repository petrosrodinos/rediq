import { useEffect, useState, type FC } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FolderSearch } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./components/chat-panel";
import { SourcesPanel } from "./components/sources-panel";
import { useGetResearchProjects } from "@/features/research-projects/hooks/use-research-projects";
import {
  useGetConversation,
  useGetConversations,
  useCreateConversation,
  useSendConversationMessage,
} from "@/features/conversations/hooks/use-conversations";
import { ConversationModes, MessageRoles, type ConversationMode } from "@/features/conversations/interfaces/conversations.interfaces";
import { useActiveProjectStore } from "@/stores/active-project";
import { Routes } from "@/routes/routes";

const AssistantPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeProjectId } = useActiveProjectStore();

  const projects = useGetResearchProjects({ limit: 100, order_by: "updated_at", order_direction: "desc" });
  const projectIdParam = searchParams.get("project");
  const projectId = projectIdParam || activeProjectId || projects.data?.data[0]?.id || "";
  const project = projects.data?.data.find((p) => p.id === projectId);

  const [mode, setMode] = useState<ConversationMode>(ConversationModes.GROUNDED);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const conversations = useGetConversations(projectId, { limit: 20 });
  const conversation = useGetConversation(conversationId ?? "");
  const createConversation = useCreateConversation();
  const sendMessage = useSendConversationMessage();

  useEffect(() => {
    setConversationId(null);
  }, [projectId]);

  useEffect(() => {
    if (!conversationId && conversations.data?.data.length) {
      setConversationId(conversations.data.data[0].id);
      setMode(conversations.data.data[0].mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.data]);

  const ensureConversation = async (): Promise<string> => {
    if (conversationId) return conversationId;
    const created = await createConversation.mutateAsync({ researchProjectId: projectId, dto: { mode } });
    setConversationId(created.id);
    return created.id;
  };

  const handleSend = async (content: string) => {
    const id = await ensureConversation();
    await sendMessage.mutateAsync({ id, dto: { content } });
  };

  const handleNewChat = async () => {
    const created = await createConversation.mutateAsync({ researchProjectId: projectId, dto: { mode } });
    setConversationId(created.id);
  };

  const messages = conversation.data?.messages ?? [];
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === MessageRoles.ASSISTANT);

  if (!projects.isLoading && !projects.data?.data.length) {
    return (
      <div className="mx-auto max-w-[900px]">
        <EmptyState
          icon={<FolderSearch className="h-5 w-5" />}
          title="No research projects yet"
          description="Start an analysis first — the assistant answers from what it collects."
          action={
            <Button asChild size="sm">
              <Link to={Routes.dashboard.new_analysis}>Start new analysis</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">AI assistant</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ask questions and get answers cited back to your collected evidence.</p>
        </div>
        <Select
          value={projectId}
          onValueChange={(value) => {
            const next = new URLSearchParams(searchParams);
            next.set("project", value);
            setSearchParams(next, { replace: true });
          }}
        >
          <SelectTrigger aria-label="Project" className="w-64">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {(projects.data?.data ?? []).map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <ChatPanel
          projectName={project?.name}
          commentsAnalyzed={project?.comments_analyzed}
          mode={mode}
          onModeChange={(next) => {
            setMode(next);
            setConversationId(null);
          }}
          messages={messages}
          isLoadingMessages={conversation.isLoading && !!conversationId}
          isSending={sendMessage.isPending || createConversation.isPending}
          onSend={handleSend}
          onNewChat={handleNewChat}
        />
        <SourcesPanel citations={lastAssistantMessage?.citations ?? []} />
      </div>
    </div>
  );
};

export default AssistantPage;
