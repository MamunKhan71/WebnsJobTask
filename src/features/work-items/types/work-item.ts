import type { PRIORITIES, STAGES } from "../constants/workflow";

export type Stage = (typeof STAGES)[number]["id"];
export type Priority = (typeof PRIORITIES)[number]["id"];

export interface Person {
  readonly id: string;
  readonly name: string;
}

export interface WorkItem {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly stage: Stage;
  readonly priority: Priority;
  readonly assigneeId: string | null;
  readonly dueDate: string | null; 
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
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
