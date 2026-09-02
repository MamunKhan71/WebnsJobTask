import { PRIORITY_IDS } from "../constants/workflow";
import { PEOPLE } from "../data/people";
import type { WorkItem } from "../types/work-item";
import type { ListParams } from "./view-params";

const nameById = new Map(PEOPLE.map((person) => [person.id, person.name.toLowerCase()]));

const priorityRank = new Map(PRIORITY_IDS.map((id, index) => [id, index]));

function isOverdue(item: WorkItem, today: string): boolean {
  return item.dueDate !== null && item.dueDate < today && item.stage !== "done";
}

function matchesSearch(item: WorkItem, needle: string): boolean {
  if (item.title.toLowerCase().includes(needle)) return true;
  if (item.tags.some((tag) => tag.toLowerCase().includes(needle))) return true;
  if (item.assigneeId !== null) {
    const name = nameById.get(item.assigneeId);
    if (name !== undefined && name.includes(needle)) return true;
  }
  return false;
}

function compareDue(a: WorkItem, b: WorkItem): number {
  if (a.dueDate === null && b.dueDate === null) return 0;
  if (a.dueDate === null) return 1;
  if (b.dueDate === null) return -1;
  return a.dueDate.localeCompare(b.dueDate);
}

function comparePriority(a: WorkItem, b: WorkItem): number {
  return (priorityRank.get(b.priority) ?? 0) - (priorityRank.get(a.priority) ?? 0);
}

export function applyView(
  items: readonly WorkItem[],
  params: ListParams,
  now: Date = new Date(),
): readonly WorkItem[] {
  const today = now.toISOString().slice(0, 10);
  const needle = params.search.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (params.stage !== "all" && item.stage !== params.stage) return false;
    if (params.priority !== "all" && item.priority !== params.priority) return false;
    if (params.assignee === "none" && item.assigneeId !== null) return false;
    if (params.assignee !== "all" && params.assignee !== "none" && item.assigneeId !== params.assignee)
      return false;
    if (params.overdueOnly && !isOverdue(item, today)) return false;
    if (needle !== "" && !matchesSearch(item, needle)) return false;
    return true;
  });

  const sorted = [...filtered];
  switch (params.sort) {
    case "updated":
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      break;
    case "created":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "due":
      sorted.sort((a, b) => compareDue(a, b) || comparePriority(a, b));
      break;
    case "priority":
      sorted.sort((a, b) => comparePriority(a, b) || compareDue(a, b));
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  return sorted;
}
