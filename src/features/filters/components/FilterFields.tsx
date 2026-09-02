import type { ReactElement } from "react";
import { Dropdown, type DropdownOption } from "../../../shared/components/Dropdown";
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

const assigneeOptions: readonly DropdownOption<string>[] = [
  { value: "all", label: "Anyone" },
  { value: "none", label: "Unassigned" },
  ...PEOPLE.map((person) => ({ value: person.id, label: person.name })),
];

const priorityOptions: readonly DropdownOption<Priority | "all">[] = [
  { value: "all", label: "Any" },
  ...[...PRIORITIES].reverse().map((priority) => ({ value: priority.id, label: priority.label })),
];

const sortOptions: readonly DropdownOption<SortId>[] = SORT_OPTIONS.map((option) => ({
  value: option.id,
  label: option.label,
}));

export function FilterFields({
  params,
  layout,
  onAssignee,
  onPriority,
  onOverdue,
  onSort,
}: FilterFieldsProps): ReactElement {
  const stacked = layout === "stacked";

  const triggerClass = stacked
    ? "inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 text-base text-ink-secondary transition-colors hover:border-line-strong"
    : "inline-flex min-h-10 max-w-45 items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 text-sm text-ink-secondary transition-colors hover:border-line-strong";
  const labelClass = stacked
    ? "text-xs font-semibold uppercase tracking-wider text-ink-muted"
    : "sr-only";
  const fieldClass = stacked ? "flex flex-col gap-1" : "flex min-w-0 flex-col gap-1";

  return (
    <div className={stacked ? "flex flex-col gap-4" : "flex flex-wrap items-center gap-2"}>
      <div className={fieldClass}>
        <span className={labelClass}>Assignee</span>
        <Dropdown
          value={params.assignee}
          options={assigneeOptions}
          ariaLabel="Filter by assignee"
          triggerPrefix={stacked ? "" : "Assignee: "}
          buttonClassName={triggerClass}
          onChange={onAssignee}
        />
      </div>

      <div className={fieldClass}>
        <span className={labelClass}>Priority</span>
        <Dropdown
          value={params.priority}
          options={priorityOptions}
          ariaLabel="Filter by priority"
          triggerPrefix={stacked ? "" : "Priority: "}
          buttonClassName={triggerClass}
          onChange={onPriority}
        />
      </div>

      <div className={fieldClass}>
        <span className={labelClass}>Sort by</span>
        <Dropdown
          value={params.sort}
          options={sortOptions}
          ariaLabel="Sort work items"
          triggerPrefix={stacked ? "" : "Sort: "}
          buttonClassName={triggerClass}
          onChange={onSort}
        />
      </div>

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
