import { PRIORITY_IDS, STAGE_IDS } from "../constants/workflow";
import type { Priority, Stage, WorkItem } from "../types/work-item";
import { PEOPLE } from "./people";

const ITEM_COUNT = 300;

function createRng(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, values: readonly T[]): T {
  const value = values[Math.floor(rng() * values.length)];
  if (value === undefined) {
    throw new Error("pick() called with an empty array");
  }
  return value;
}

function pickWeighted<T>(rng: () => number, entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rng() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) {
      return value;
    }
  }
  return entries[entries.length - 1]![0];
}

const VERBS = [
  "Fix",
  "Investigate",
  "Refactor",
  "Design",
  "Implement",
  "Review",
  "Document",
  "Migrate",
  "Optimize",
  "Update",
  "Remove",
  "Audit",
  "Prototype",
  "Ship",
];

const OBJECTS = [
  "login flow",
  "invoice export",
  "customer onboarding emails",
  "search indexing job",
  "payment webhook retries",
  "dashboard loading state",
  "user permissions matrix",
  "mobile navigation drawer",
  "notification preferences page",
  "CSV import validation",
  "API rate limiting",
  "session timeout handling",
  "image upload pipeline",
  "dark mode color palette",
  "signup conversion funnel",
  "database connection pooling",
  "error tracking integration",
  "release notes template",
  "staging environment config",
  "password reset emails",
  "billing address form",
  "activity feed pagination",
  "PDF report generation",
  "two-factor authentication",
  "admin audit log",
];

const QUALIFIERS = [
  "",
  " for enterprise accounts",
  " on Safari",
  " before the Q3 release",
  " after the framework upgrade",
  " reported by support",
  " for the Dhaka office pilot",
  " when the user has no saved data",
  " under slow network conditions",
];

const EXTREME_TITLES = [
  "Investigate why the nightly reconciliation job intermittently double-counts refunded invoices when the customer's billing currency differs from the account default and the refund crosses a month boundary",
  "Fix typo",
  "Customers on the annual plan who downgraded before March are still being shown the old pricing table in the billing modal — needs repro steps and a decision on whether we honor the old price",
  "Upgrade Node",
  "Rewrite the entire notification delivery layer to support per-channel user preferences, quiet hours across timezones, digest batching, and a fallback chain from push to email to SMS",
];

const DESCRIPTIONS = [
  "Reported multiple times this sprint. Needs a repro before we can size it.",
  "Blocked on a decision from the platform team — chase if no answer by Thursday.",
  "Follow-up from the retro. Small on its own but touches shared code, so needs a careful review.",
  "Support has three open tickets pointing at this. Prioritize a workaround if the fix is large.",
  "Spike first: timebox to half a day and write up findings before committing to the full change.",
  "The current behavior technically works but confuses new users — see the session recordings linked in the ticket.",
  "Part of the reliability push. Should include a rollback plan and a dashboard alert.",
  "Old implementation predates the design system; bring it in line while we're in there.",
];

const TAGS = [
  "frontend",
  "backend",
  "bug",
  "design",
  "infra",
  "docs",
  "research",
  "customer",
] as const;

const STAGE_WEIGHTS: readonly (readonly [Stage, number])[] = [
  ["backlog", 40],
  ["in_progress", 25],
  ["in_review", 13],
  ["done", 22],
];

const PRIORITY_WEIGHTS: readonly (readonly [Priority, number])[] = [
  ["low", 22],
  ["medium", 40],
  ["high", 25],
  ["urgent", 13],
];

const DAY_MS = 24 * 60 * 60 * 1000;

function toIsoDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function generateTitle(rng: () => number, index: number): string {
  const extremeSlot = Math.floor(index / (ITEM_COUNT / EXTREME_TITLES.length));
  if (index % Math.floor(ITEM_COUNT / EXTREME_TITLES.length) === 7) {
    const extreme = EXTREME_TITLES[extremeSlot % EXTREME_TITLES.length];
    if (extreme !== undefined) {
      return extreme;
    }
  }
  return `${pick(rng, VERBS)} ${pick(rng, OBJECTS)}${pick(rng, QUALIFIERS)}`;
}

function generateDueDate(rng: () => number, stage: Stage, now: number): string | null {
  if (rng() < 0.4) {
    return null;
  }
  if (stage === "done") {
    return toIsoDate(now - Math.floor(rng() * 45) * DAY_MS);
  }
  const offset = Math.floor((rng() * 2 - 1) * (rng() < 0.5 ? 12 : 60));
  const clamped = Math.max(-25, Math.min(60, offset));
  return toIsoDate(now + clamped * DAY_MS);
}

function generateTags(rng: () => number): readonly string[] {
  const count = pickWeighted(rng, [
    [0, 25],
    [1, 40],
    [2, 25],
    [3, 10],
  ]);
  const shuffled = [...TAGS].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}

export function generateSeedItems(now: number = Date.now()): WorkItem[] {
  const rng = createRng(20260901);
  const items: WorkItem[] = [];

  for (let index = 0; index < ITEM_COUNT; index++) {
    const stage = pickWeighted(rng, STAGE_WEIGHTS);
    const createdAt = now - Math.floor(rng() * 120 + 1) * DAY_MS - Math.floor(rng() * DAY_MS);
    const updatedAt = createdAt + Math.floor(rng() * (now - createdAt));

    items.push({
      id: `wi-${String(index + 1).padStart(3, "0")}`,
      title: generateTitle(rng, index),
      description: rng() < 0.55 ? pick(rng, DESCRIPTIONS) : null,
      stage,
      priority: pickWeighted(rng, PRIORITY_WEIGHTS),
      assigneeId: rng() < 0.15 ? null : pick(rng, PEOPLE).id,
      dueDate: generateDueDate(rng, stage, now),
      tags: generateTags(rng),
      createdAt: new Date(createdAt).toISOString(),
      updatedAt: new Date(updatedAt).toISOString(),
    });
  }

  const guaranteed: readonly (readonly [number, Partial<WorkItem>])[] = [
    [3, { stage: "in_progress", dueDate: toIsoDate(now), priority: "high" }],
    [11, { stage: "in_progress", dueDate: toIsoDate(now - 6 * DAY_MS), priority: "urgent" }],
    [19, { stage: "backlog", assigneeId: null, priority: "urgent" }],
  ];
  for (const [index, overrides] of guaranteed) {
    const existing = items[index];
    if (existing !== undefined) {
      items[index] = { ...existing, ...overrides };
    }
  }

  return items;
}

export { PRIORITY_IDS, STAGE_IDS, TAGS };
