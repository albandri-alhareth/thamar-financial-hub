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
        "rounded-2xl border p-5 transition-shadow hover:shadow-[var(--shadow-soft)]",
        accent ? "border-transparent bg-primary text-primary-foreground" : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn("text-sm", accent ? "opacity-85" : "text-muted-foreground")}>{label}</p>
        {icon ? (
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-xl",
              accent ? "bg-primary-foreground/15" : "bg-secondary text-primary",
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      {typeof progress === "number" ? (
        <div
          className={cn(
            "mt-3 h-2 w-full overflow-hidden rounded-full",
            accent ? "bg-primary-foreground/20" : "bg-secondary",
          )}
        >
          <div
            className={cn("h-full rounded-full", accent ? "bg-primary-foreground" : "bg-accent")}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
      {hint ? (
        <p className={cn("mt-2 text-xs", accent ? "opacity-80" : "text-muted-foreground")}>{hint}</p>
      ) : null}
    </div>
  );
}
