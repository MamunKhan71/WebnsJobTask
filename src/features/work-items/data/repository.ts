import type { NewWorkItemInput, Stage, WorkItem } from "../types/work-item";
import { generateSeedItems } from "./seed";

let store: WorkItem[] | null = null;
let nextId = 1000;

function getStore(): WorkItem[] {
  store ??= generateSeedItems();
  return store;
}

function delay(): Promise<void> {
  const ms = 350 + Math.random() * 400;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldFail(): boolean {
  return new URLSearchParams(window.location.search).get("fail") === "1";
}

async function simulateRequest(): Promise<void> {
  await delay();
  if (shouldFail()) {
    throw new Error("The server could not be reached.");
  }
}

export async function fetchWorkItems(): Promise<readonly WorkItem[]> {
  await simulateRequest();
  return getStore().map((item) => ({ ...item }));
}

export async function createWorkItem(input: NewWorkItemInput): Promise<WorkItem> {
  await simulateRequest();
  const now = new Date().toISOString();
  const item: WorkItem = {
    ...input,
    id: `wi-${nextId++}`,
    createdAt: now,
    updatedAt: now,
  };
  getStore().unshift(item);
  return { ...item };
}

export async function updateWorkItemStage(id: string, stage: Stage): Promise<WorkItem> {
  await simulateRequest();
  const items = getStore();
  const index = items.findIndex((item) => item.id === id);
  const existing = items[index];
  if (existing === undefined) {
    throw new Error(`Work item ${id} not found.`);
  }
  const updated: WorkItem = { ...existing, stage, updatedAt: new Date().toISOString() };
  items[index] = updated;
  return { ...updated };
}
