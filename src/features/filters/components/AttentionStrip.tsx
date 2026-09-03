import type { ReactElement } from "react";
import { useWorkItemsState } from "../../work-items";
import { useListParams } from "../hooks/useListParams";

export function AttentionStrip(): ReactElement | null {
  const { items, status } = useWorkItemsState();
  const { params, setOverdueOnly, setPriority, setAssignee } = useListParams();

  if (status !== "ready" || items.length === 0) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);
  const active = items.filter((item) => item.stage !== "done");
  const overdue = active.filter(
    (item) => item.dueDate !== null && item.dueDate < today,
  ).length;
  const urgent = active.filter((item) => item.priority === "urgent").length;
  const unassigned = active.filter((item) => item.assigneeId === null).length;

  if (overdue === 0 && urgent === 0 && unassigned === 0) {
    return null;
  }

  const baseChip =
    "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-transparent px-3 text-sm font-medium transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Needs attention">
      {overdue > 0 && (
        <button
          type="button"
          className={`${baseChip} bg-danger-subtle text-danger hover:border-danger aria-pressed:bg-danger aria-pressed:text-white`}
          aria-pressed={params.overdueOnly}
          onClick={() => setOverdueOnly(!params.overdueOnly)}
        >
          <strong className="font-semibold tabular-nums">{overdue}</strong> overdue
        </button>
      )}
      {urgent > 0 && (
        <button
          type="button"
          className={`${baseChip} bg-warning-subtle text-warning hover:border-warning aria-pressed:bg-warning aria-pressed:text-white`}
          aria-pressed={params.priority === "urgent"}
          onClick={() => setPriority(params.priority === "urgent" ? "all" : "urgent")}
        >
          <strong className="font-semibold tabular-nums">{urgent}</strong> urgent
        </button>
      )}
      {unassigned > 0 && (
        <button
          type="button"
          className={`${baseChip} bg-neutral-subtle text-neutral hover:border-neutral aria-pressed:bg-neutral aria-pressed:text-white`}
          aria-pressed={params.assignee === "none"}
          onClick={() => setAssignee(params.assignee === "none" ? "all" : "none")}
        >
          <strong className="font-semibold tabular-nums">{unassigned}</strong> unassigned
        </button>
      )}
    </div>
  );
}
