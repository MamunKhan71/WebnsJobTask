import type { ReactElement } from "react";
import {
  PEOPLE,
  PRIORITIES,
  SORT_OPTIONS,
  type AssigneeFilter,
  type ListParams,
  type Priority,
  type SortId,
} from "../../work-items";

interface FilterFieldsProps {
  readonly params: ListParams;
  readonly layout: "inline" | "stacked";
  readonly onAssignee: (value: AssigneeFilter) => void;
  readonly onPriority: (value: Priority | "all") => void;
  readonly onOverdue: (value: boolean) => void;
  readonly onSort: (value: SortId) => void;
}

export function FilterFields({
  params,
  layout,
  onAssignee,
  onPriority,
  onOverdue,
  onSort,
}: FilterFieldsProps): ReactElement {
  const stacked = layout === "stacked";

  const selectClass = `${
    stacked ? "min-h-11 text-base" : "min-h-10 max-w-[180px] text-sm"
  } truncate rounded-md border border-line bg-surface px-3 text-ink-secondary transition-colors hover:border-line-strong`;
  const labelClass = stacked
    ? "text-xs font-semibold uppercase tracking-wider text-ink-muted"
    : "sr-only";

  return (
    <div className={stacked ? "flex flex-col gap-4" : "flex flex-wrap items-center gap-2"}>
      <label className="flex min-w-0 flex-col gap-1">
        <span className={labelClass}>Assignee</span>
        <select
          className={selectClass}
          value={params.assignee}
          onChange={(event) => onAssignee(event.target.value)}
        >
          <option value="all">{stacked ? "Anyone" : "Assignee: anyone"}</option>
          <option value="none">Unassigned</option>
          {PEOPLE.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-0 flex-col gap-1">
        <span className={labelClass}>Priority</span>
        <select
          className={selectClass}
          value={params.priority}
          onChange={(event) => onPriority(event.target.value as Priority | "all")}
        >
          <option value="all">{stacked ? "Any priority" : "Priority: any"}</option>
          {[...PRIORITIES].reverse().map((priority) => (
            <option key={priority.id} value={priority.id}>
              {priority.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-0 flex-col gap-1">
        <span className={labelClass}>Sort by</span>
        <select
          className={selectClass}
          value={params.sort}
          onChange={(event) => onSort(event.target.value as SortId)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {stacked ? option.label : `Sort: ${option.label}`}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className={`${
          stacked ? "min-h-11 justify-center" : "min-h-10"
        } group inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-line bg-surface px-3 text-sm font-medium text-ink-secondary transition-colors hover:border-line-strong aria-pressed:border-danger aria-pressed:bg-danger-subtle aria-pressed:text-danger`}
        aria-pressed={params.overdueOnly}
        onClick={() => onOverdue(!params.overdueOnly)}
      >
        <span
          className="size-2 rounded-full bg-line-strong transition-colors group-aria-pressed:bg-danger"
          aria-hidden="true"
        />
        Overdue only
      </button>
    </div>
  );
}
