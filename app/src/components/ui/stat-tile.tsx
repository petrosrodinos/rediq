import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatTileProps {
  label: string;
  value?: ReactNode;
  detail?: ReactNode;
  isLoading?: boolean;
  className?: string;
}

export const StatTile: FC<StatTileProps> = ({ label, value, detail, isLoading, className }) => {
  return (
    <div className={cn("rounded-xl border border-border p-3", className)}>
      <div className="font-mono text-[10px] text-muted-foreground">{label}</div>
      {isLoading ? (
        <Skeleton className="mt-1.5 h-6 w-16" />
      ) : (
        <div className="font-display text-xl font-semibold tabular-nums">{value}</div>
      )}
      {detail ? <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{detail}</div> : null}
    </div>
  );
};
