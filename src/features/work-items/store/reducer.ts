import type { WorkItem } from "../types/work-item";
import type { WorkItemsAction } from "./actions";

export type LoadStatus = "idle" | "loading" | "ready" | "error";

export interface WorkItemsState {
  readonly items: readonly WorkItem[];
  readonly status: LoadStatus;
  readonly errorMessage: string | null;
}

export const initialWorkItemsState: WorkItemsState = {
  items: [],
  status: "idle",
  errorMessage: null,
};

function replaceItem(
  items: readonly WorkItem[],
  id: string,
  update: (item: WorkItem) => WorkItem,
): readonly WorkItem[] {
  return items.map((item) => (item.id === id ? update(item) : item));
}

export function workItemsReducer(
  state: WorkItemsState,
  action: WorkItemsAction,
): WorkItemsState {
  switch (action.type) {
    case "load/started":
      return { ...state, status: "loading", errorMessage: null };

    case "load/succeeded":
      return { items: action.items, status: "ready", errorMessage: null };

    case "load/failed":
      return { ...state, status: "error", errorMessage: action.message };

    case "item/added":
      return { ...state, items: [action.item, ...state.items] };

    case "stage/changeStarted":
      return {
        ...state,
        items: replaceItem(state.items, action.id, (item) => ({
          ...item,
          stage: action.stage,
        })),
      };

    case "stage/changeSucceeded":
      return {
        ...state,
        items: replaceItem(state.items, action.item.id, () => action.item),
      };

    case "stage/changeFailed":
      return {
        ...state,
        items: replaceItem(state.items, action.id, (item) => ({
          ...item,
          stage: action.previousStage,
        })),
      };
  }
}
