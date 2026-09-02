import type { ReactElement } from "react";
import { PRIORITIES, STAGES } from "../constants/workflow";
import type { Priority, Stage } from "../types/work-item";
import type { DueStatus } from "../utils/dates";

const stageLabels = new Map<Stage, string>(STAGES.map((stage) => [stage.id, stage.label]));
const priorityLabels = new Map<Priority, string>(
  PRIORITIES.map((priority) => [priority.id, priority.label]),
);

const badgeBase =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-[2px] text-xs font-medium leading-[1.4]";

export const stageStyles: Record<Stage, string> = {
  backlog: "bg-neutral-subtle text-neutral",
  in_progress: "bg-info-subtle text-info",
  in_review: "bg-review-subtle text-review",
  done: "bg-success-subtle text-success",
};

export function StageBadge({ stage }: { stage: Stage }): ReactElement {
  return <span className={`${badgeBase} ${stageStyles[stage]}`}>{stageLabels.get(stage)}</span>;
}

export function PriorityBadge({ priority }: { priority: Priority }): ReactElement | null {
  if (priority === "low" || priority === "medium") {
    return null;
  }
  const tone =
    priority === "urgent" ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning";
  return <span className={`${badgeBase} ${tone}`}>{priorityLabels.get(priority)}</span>;
}

const dueBase = "whitespace-nowrap text-xs tabular-nums";

export function DueBadge({ status }: { status: DueStatus }): ReactElement | null {
  switch (status.kind) {
    case "none":
      return null;
    case "overdue":
      return <span className={`${dueBase} font-semibold text-danger`}>{status.label}</span>;
    case "today":
      return <span className={`${dueBase} font-semibold text-warning`}>{status.label}</span>;
    case "upcoming":
    case "past":
      return <span className={`${dueBase} text-ink-muted`}>{status.label}</span>;
  }
}
