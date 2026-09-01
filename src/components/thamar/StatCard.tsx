import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
  progress,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  accent?: boolean;
  progress?: number;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border p-4 sm:p-5",
        accent ? "border-primary/40 bg-primary-soft" : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "min-w-0 text-sm leading-snug",
            accent ? "text-primary-strong" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        {icon ? (
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-xl",
              accent ? "bg-card text-primary-strong" : "bg-secondary text-primary-strong",
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>

      <p
        className={cn(
          "mt-3 text-xl font-bold tracking-tight tabular-nums sm:text-[1.375rem]",
          accent && "text-primary-strong",
        )}
      >
        {value}
      </p>

      <div className="mt-auto">
        {typeof progress === "number" ? (
          <div className={cn("mt-3 h-1.5 w-full overflow-hidden rounded-full", accent ? "bg-card" : "bg-secondary")}>
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        ) : null}
        {hint ? (
          <p className={cn("mt-2 text-xs", accent ? "text-primary-strong/80" : "text-muted-foreground")}>
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
