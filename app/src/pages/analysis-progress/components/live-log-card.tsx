import type { FC } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobEventLevel, type JobEvent } from "@/features/analysis-jobs/interfaces/analysis-jobs.interfaces";
import { formatClock } from "@/lib/date";
import { toSafeErrorMessage } from "@/lib/error-message";

interface LiveLogCardProps {
  events: JobEvent[];
  isLoading: boolean;
  isLive?: boolean;
  className?: string;
}

const textClassByLevel: Record<string, string> = {
  [JobEventLevel.ERROR]: "text-rose",
  [JobEventLevel.WARNING]: "text-amber",
  [JobEventLevel.INFO]: "text-muted-foreground",
};

export const LiveLogCard: FC<LiveLogCardProps> = ({ events, isLoading, isLive, className }) => {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Live log</CardTitle>
        {isLive ? (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
            </span>
            live
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {isLoading ? (
          <div className="space-y-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        ) : !events.length ? (
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] text-muted-foreground">{isLive ? "Listening for events…" : "No events yet."}</p>
            {isLive ? <Skeleton className="h-3 w-3/4" /> : null}
          </div>
        ) : (
          <div className="min-h-[180px] flex-1 space-y-1.5 overflow-y-auto font-mono text-[11px]">
            {isLive ? <Skeleton className="h-3 w-2/3" /> : null}
            {events.map((event) => (
              <div
                key={event.id}
                className={cn("animate-in fade-in slide-in-from-top-1 duration-300", textClassByLevel[event.level] ?? "text-muted-foreground")}
              >
                {formatClock(event.created_at)}{" "}
                {event.level === JobEventLevel.ERROR ? toSafeErrorMessage(event.message, "Something went wrong.") : event.message}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
