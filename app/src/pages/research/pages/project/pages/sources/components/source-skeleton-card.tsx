import type { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SourceSkeletonCard: FC = () => {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
};
