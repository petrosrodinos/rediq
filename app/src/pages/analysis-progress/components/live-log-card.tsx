import type { FC } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobEventLevel, type JobEvent } from "@/features/analysis-jobs/interfaces/analysis-jobs.interfaces";
import { formatClock } from "@/lib/date";

interface LiveLogCardProps {
  events: JobEvent[];
  isLoading: boolean;
}

const textClassByLevel: Record<string, string> = {
  [JobEventLevel.ERROR]: "text-rose",
  [JobEventLevel.WARNING]: "text-amber",
  [JobEventLevel.INFO]: "text-muted-foreground",
};

export const LiveLogCard: FC<LiveLogCardProps> = ({ events, isLoading }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Live log</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        ) : !events.length ? (
          <p className="font-mono text-[11px] text-muted-foreground">No events yet.</p>
        ) : (
          <div className="max-h-[180px] space-y-1.5 overflow-y-auto font-mono text-[11px]">
            {events.map((event) => (
              <div key={event.id} className={cn(textClassByLevel[event.level] ?? "text-muted-foreground")}>
                {formatClock(event.created_at)} {event.message}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
