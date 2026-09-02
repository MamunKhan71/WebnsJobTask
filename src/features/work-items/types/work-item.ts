import type { PRIORITIES, STAGES } from "../constants/workflow";

export type Stage = (typeof STAGES)[number]["id"];
export type Priority = (typeof PRIORITIES)[number]["id"];

export interface Person {
  readonly id: string;
  readonly name: string;
}

/**
 * A single piece of work. Assignee is a reference (not an embedded object)
 * so the model stays relational — the same shape a backend would return.
 * Dates are ISO strings to keep the state serializable.
 */
export interface WorkItem {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly stage: Stage;
  readonly priority: Priority;
  readonly assigneeId: string | null;
  readonly dueDate: string | null; // "yyyy-mm-dd"
  readonly tags: readonly string[];
  readonly createdAt: string; // ISO datetime
  readonly updatedAt: string; // ISO datetime
}

export interface NewWorkItemInput {
  readonly title: string;
  readonly description: string | null;
  readonly stage: Stage;
  readonly priority: Priority;
  readonly assigneeId: string | null;
  readonly dueDate: string | null;
  readonly tags: readonly string[];
}
