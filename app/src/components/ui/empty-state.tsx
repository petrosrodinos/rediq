import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center", className)}>
      {icon ? <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">{icon}</div> : null}
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
};
