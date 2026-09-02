import type { ReactElement } from "react";
import { STAGES, type Stage } from "../../work-items";

export interface StageCounts {
  readonly all: number;
  readonly byStage: ReadonlyMap<Stage, number>;
}

export function StageTabs({
  value,
  counts,
  onChange,
}: {
  value: Stage | "all";
  counts: StageCounts;
  onChange: (value: Stage | "all") => void;
}): ReactElement {
  const options: readonly { id: Stage | "all"; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    ...STAGES.map((stage) => ({
      id: stage.id,
      label: stage.label,
      count: counts.byStage.get(stage.id) ?? 0,
    })),
  ];

  return (
    <div
      className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-sunken p-0.75 scrollbar-none [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Filter by stage"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="group inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium text-ink-secondary transition-[background-color,color,box-shadow] hover:text-ink aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-sm"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
          <span className="rounded-full bg-neutral-subtle px-2 text-xs leading-relaxed tabular-nums text-ink-muted group-aria-pressed:bg-accent-subtle group-aria-pressed:text-accent">
            {option.count}
          </span>
        </button>
      ))}
    </div>
  );
}
