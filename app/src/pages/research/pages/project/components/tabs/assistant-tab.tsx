import type { FC } from "react";
import { Link } from "react-router-dom";
import { MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Routes } from "@/routes/routes";

interface AssistantTabProps {
  researchProjectId: string;
}

export const AssistantTab: FC<AssistantTabProps> = ({ researchProjectId }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <MessageCircleQuestion className="h-5 w-5" />
        </span>
        <div className="max-w-md space-y-1">
          <p className="text-sm font-semibold">Ask about this project's evidence</p>
          <p className="text-sm text-muted-foreground">
            The assistant only answers from comments inside this project, with citations attached to every claim.
          </p>
        </div>
        <Button asChild>
          <Link to={`${Routes.dashboard.assistant}?project=${researchProjectId}`}>Open assistant</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
