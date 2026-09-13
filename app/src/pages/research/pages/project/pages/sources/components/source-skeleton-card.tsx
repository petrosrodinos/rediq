import type { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SourceSkeletonCard: FC = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="ml-auto h-4 w-12 rounded-full" />
          </div>

          <Skeleton className="h-4 w-3/5" />

          <div className="space-y-1.5 pl-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <div className="ml-auto flex items-center gap-1.5">
              <Skeleton className="h-7 w-20 rounded-md" />
              <Skeleton className="h-7 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
