import type { FC } from "react";
import { cn } from "@/lib/utils";

export interface MiniBarChartDatum {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: MiniBarChartDatum[];
  className?: string;
  barClassName?: string;
  highlightIndex?: number;
}

/**
 * Plain CSS bar chart (no charting library) — matches the mockup's hand-rolled
 * "This month" / dataset-analytics bars, which never need axes, tooltips, or zoom.
 */
export const MiniBarChart: FC<MiniBarChartProps> = ({ data, className, barClassName, highlightIndex }) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("grid items-end gap-1.5", className)} style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
      {data.map((datum, index) => (
        <div
          key={datum.label + index}
          className={cn(
            "rounded-t border border-border bg-muted",
            index === highlightIndex && "border-transparent bg-foreground",
            barClassName,
          )}
          style={{ height: `${Math.max((datum.value / max) * 100, 4)}%` }}
          title={`${datum.label}: ${datum.value}`}
        />
      ))}
    </div>
  );
};
