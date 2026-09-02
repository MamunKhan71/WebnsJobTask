import type { ReactElement } from "react";
import type { Person } from "../types/work-item";
import { getInitials } from "../utils/dates";

function hueFor(id: string): number {
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash) % 360;
}

export function Assignee({ person }: { person: Person | null }): ReactElement {
  if (person === null) {
    return (
      <span className="inline-flex min-w-0 items-center gap-2 text-sm text-ink-muted">
        <span
          className="size-6 shrink-0 rounded-full border-[1.5px] border-dashed border-line-strong"
          aria-hidden="true"
        />
        Unassigned
      </span>
    );
  }
  return (
    <span className="inline-flex min-w-0 items-center gap-2 text-sm text-ink-secondary">
      <span
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
        style={{ backgroundColor: `hsl(${hueFor(person.id)} 45% 38%)` }}
        aria-hidden="true"
      >
        {getInitials(person.name)}
      </span>
      <span className="truncate">{person.name}</span>
    </span>
  );
}
