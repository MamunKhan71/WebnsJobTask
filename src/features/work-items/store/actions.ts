import type { Stage, WorkItem } from "../types/work-item";

export type WorkItemsAction =
  | { readonly type: "load/started" }
  | { readonly type: "load/succeeded"; readonly items: readonly WorkItem[] }
  | { readonly type: "load/failed"; readonly message: string }
  | { readonly type: "item/added"; readonly item: WorkItem }
  | { readonly type: "stage/changeStarted"; readonly id: string; readonly stage: Stage }
  | { readonly type: "stage/changeSucceeded"; readonly item: WorkItem }
  | {
    readonly type: "stage/changeFailed";
    readonly id: string;
    readonly previousStage: Stage;
  };
