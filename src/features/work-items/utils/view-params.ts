import { PRIORITY_IDS, STAGE_IDS } from "../constants/workflow";
import type { Priority, Stage } from "../types/work-item";


export const SORT_OPTIONS = [
  { id: "updated", label: "Recently updated" },
  { id: "due", label: "Due date" },
  { id: "priority", label: "Priority" },
  { id: "created", label: "Newest first" },
  { id: "title", label: "Title A–Z" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export const DEFAULT_SORT: SortId = "updated";
export const PAGE_SIZE = 25;

export type AssigneeFilter = string | "all" | "none";

export interface ListParams {
  readonly search: string;
  readonly stage: Stage | "all";
  readonly assignee: AssigneeFilter;
  readonly priority: Priority | "all";
  readonly overdueOnly: boolean;
  readonly sort: SortId;
  readonly page: number;
}

function isStage(value: string): value is Stage {
  return (STAGE_IDS as readonly string[]).includes(value);
}

function isPriority(value: string): value is Priority {
  return (PRIORITY_IDS as readonly string[]).includes(value);
}

function isSortId(value: string): value is SortId {
  return SORT_OPTIONS.some((option) => option.id === value);
}

export function parseListParams(query: URLSearchParams): ListParams {
  const stage = query.get("stage") ?? "";
  const priority = query.get("priority") ?? "";
  const sort = query.get("sort") ?? "";
  const rawPage = Number.parseInt(query.get("page") ?? "1", 10);

  return {
    search: query.get("q") ?? "",
    stage: isStage(stage) ? stage : "all",
    assignee: query.get("assignee") ?? "all",
    priority: isPriority(priority) ? priority : "all",
    overdueOnly: query.get("overdue") === "1",
    sort: isSortId(sort) ? sort : DEFAULT_SORT,
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
  };
}

/** Filters (not search, sort, or page) that differ from the default view. */
export function countActiveFilters(params: ListParams): number {
  let count = 0;
  if (params.stage !== "all") count += 1;
  if (params.assignee !== "all") count += 1;
  if (params.priority !== "all") count += 1;
  if (params.overdueOnly) count += 1;
  return count;
}
