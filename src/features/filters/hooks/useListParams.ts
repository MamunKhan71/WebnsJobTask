import {
  parseListParams,
  type AssigneeFilter,
  type ListParams,
  type Priority,
  type SortId,
  type Stage,
} from "../../work-items";
import { updateUrlQuery, useUrlQuery } from "../../../shared/hooks/useUrlQuery";

interface ListParamsApi {
  readonly params: ListParams;
  readonly setSearch: (value: string) => void;
  readonly setStage: (value: Stage | "all") => void;
  readonly setAssignee: (value: AssigneeFilter) => void;
  readonly setPriority: (value: Priority | "all") => void;
  readonly setOverdueOnly: (value: boolean) => void;
  readonly setSort: (value: SortId) => void;
  readonly setPage: (value: number) => void;
  readonly clearFilters: () => void;
}

function setOrDelete(params: URLSearchParams, key: string, value: string, defaultValue: string): void {
  if (value === defaultValue) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  if (key !== "page") {
    params.delete("page");
  }
}

export function useListParams(): ListParamsApi {
  const params = parseListParams(useUrlQuery());

  return {
    params,
    setSearch: (value) =>
      updateUrlQuery((q) => setOrDelete(q, "q", value, ""), { replace: true }),
    setStage: (value) => updateUrlQuery((q) => setOrDelete(q, "stage", value, "all")),
    setAssignee: (value) => updateUrlQuery((q) => setOrDelete(q, "assignee", value, "all")),
    setPriority: (value) => updateUrlQuery((q) => setOrDelete(q, "priority", value, "all")),
    setOverdueOnly: (value) =>
      updateUrlQuery((q) => setOrDelete(q, "overdue", value ? "1" : "", "")),
    setSort: (value) => updateUrlQuery((q) => setOrDelete(q, "sort", value, "updated")),
    setPage: (value) =>
      updateUrlQuery((q) => setOrDelete(q, "page", String(value), "1")),
    clearFilters: () =>
      updateUrlQuery((q) => {
        for (const key of ["stage", "assignee", "priority", "overdue", "page"]) {
          q.delete(key);
        }
      }),
  };
}
