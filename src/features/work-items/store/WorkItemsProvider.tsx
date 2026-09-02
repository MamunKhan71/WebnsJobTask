import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactElement,
  type ReactNode,
} from "react";
import { createWorkItem, fetchWorkItems, updateWorkItemStage } from "../data/repository";
import type { NewWorkItemInput, Stage, WorkItem } from "../types/work-item";
import { initialWorkItemsState, workItemsReducer, type WorkItemsState } from "./reducer";

interface WorkItemsApi {
  readonly loadItems: () => Promise<void>;
  readonly addItem: (input: NewWorkItemInput) => Promise<WorkItem>;
  readonly moveItemToStage: (item: WorkItem, stage: Stage) => Promise<void>;
}

const StateContext = createContext<WorkItemsState | null>(null);
const ApiContext = createContext<WorkItemsApi | null>(null);

export function WorkItemsProvider({ children }: { children: ReactNode }): ReactElement {
  const [state, dispatch] = useReducer(workItemsReducer, initialWorkItemsState);

  const loadItems = useCallback(async (): Promise<void> => {
    dispatch({ type: "load/started" });
    try {
      const items = await fetchWorkItems();
      dispatch({ type: "load/succeeded", items });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      dispatch({ type: "load/failed", message });
    }
  }, []);

  const addItem = useCallback(async (input: NewWorkItemInput): Promise<WorkItem> => {
    const item = await createWorkItem(input);
    dispatch({ type: "item/added", item });
    return item;
  }, []);

  const moveItemToStage = useCallback(
    async (item: WorkItem, stage: Stage): Promise<void> => {
      if (item.stage === stage) {
        return;
      }
      dispatch({ type: "stage/changeStarted", id: item.id, stage });
      try {
        const updated = await updateWorkItemStage(item.id, stage);
        dispatch({ type: "stage/changeSucceeded", item: updated });
      } catch {
        dispatch({ type: "stage/changeFailed", id: item.id, previousStage: item.stage });
      }
    },
    [],
  );

  const api = useMemo<WorkItemsApi>(
    () => ({ loadItems, addItem, moveItemToStage }),
    [loadItems, addItem, moveItemToStage],
  );

  return (
    <ApiContext.Provider value={api}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ApiContext.Provider>
  );
}

export function useWorkItemsState(): WorkItemsState {
  const state = useContext(StateContext);
  if (state === null) {
    throw new Error("useWorkItemsState must be used inside <WorkItemsProvider>");
  }
  return state;
}

export function useWorkItemsApi(): WorkItemsApi {
  const api = useContext(ApiContext);
  if (api === null) {
    throw new Error("useWorkItemsApi must be used inside <WorkItemsProvider>");
  }
  return api;
}
