import { PEOPLE } from "../data/people";
import type { Person, WorkItem } from "../types/work-item";
import type { WorkItemsState } from "./reducer";

const peopleById: ReadonlyMap<string, Person> = new Map(
  PEOPLE.map((person) => [person.id, person]),
);

export function selectPerson(assigneeId: string | null): Person | null {
  if (assigneeId === null) {
    return null;
  }
  return peopleById.get(assigneeId) ?? null;
}

export function selectItemById(state: WorkItemsState, id: string): WorkItem | null {
  return state.items.find((item) => item.id === id) ?? null;
}

export function selectAssignees(state: WorkItemsState): readonly Person[] {
  const usedIds = new Set(
    state.items.map((item) => item.assigneeId).filter((id) => id !== null),
  );
  return PEOPLE.filter((person) => usedIds.has(person.id));
}
