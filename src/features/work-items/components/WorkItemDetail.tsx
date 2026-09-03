import type { ReactElement, ReactNode } from "react";
import { Dialog, modalDialogClass } from "../../../shared/components/Dialog";
import { updateUrlQuery, useUrlQuery } from "../../../shared/hooks/useUrlQuery";
import { PRIORITIES } from "../constants/workflow";
import { selectItemById, selectPerson } from "../store/selectors";
import { useWorkItemsState } from "../store/WorkItemsProvider";
import type { WorkItem } from "../types/work-item";
import { formatShortDate, getDueStatus } from "../utils/dates";
import { Assignee } from "./Assignee";
import { DueBadge, PriorityBadge } from "./Badges";
import { StageSelect } from "./StageSelect";

const iconProps = {
  className: "size-3.5 text-ink-muted",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const icons = {
  person: (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...iconProps}>
      <circle cx="8" cy="5" r="2.8" />
      <path d="M2.8 13.5c.9-2.6 2.8-3.9 5.2-3.9s4.3 1.3 5.2 3.9" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...iconProps}>
      <path d="M3.5 14V2.5M3.5 3h8l-1.9 2.8L11.5 8.5h-8" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...iconProps}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...iconProps}>
      <path d="M2.5 2.5h5.2l5.8 5.8a1 1 0 0 1 0 1.4l-3.8 3.8a1 1 0 0 1-1.4 0L2.5 7.7z" />
      <circle cx="5.4" cy="5.4" r="0.9" />
    </svg>
  ),
} as const;

function Field({
  icon,
  label,
  children,
}: {
  icon: keyof typeof icons;
  label: string;
  children: ReactNode;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {icons[icon]}
        {label}
      </dt>
      <dd className="flex min-w-0 items-center text-sm text-ink-secondary">{children}</dd>
    </div>
  );
}

function DetailBody({ item }: { item: WorkItem }): ReactElement {
  const person = selectPerson(item.assigneeId);
  const dueStatus = getDueStatus(item.dueDate, item.stage === "done");
  const priorityLabel = PRIORITIES.find((p) => p.id === item.priority)?.label ?? item.priority;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <StageSelect item={item} />
        <span className="rounded-md bg-sunken px-2 py-0.5 font-mono text-xs tabular-nums text-ink-muted">
          {item.id}
        </span>
      </div>

      <h2 className="text-xl font-semibold leading-snug tracking-tight">{item.title}</h2>

      {item.description !== null ? (
        <p className="rounded-lg bg-sunken/60 px-4 py-3 text-sm leading-relaxed text-ink-secondary">
          {item.description}
        </p>
      ) : (
        <p className="text-sm italic text-ink-muted">No description.</p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
        <Field icon="person" label="Assignee">
          <Assignee person={person} />
        </Field>
        <Field icon="flag" label="Priority">
          {item.priority === "high" || item.priority === "urgent" ? (
            <PriorityBadge priority={item.priority} />
          ) : (
            <span className="inline-flex items-center rounded-full bg-neutral-subtle px-2 py-0.5 text-xs font-medium text-neutral">
              {priorityLabel}
            </span>
          )}
        </Field>
        <Field icon="calendar" label="Due date">
          {item.dueDate !== null ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              {formatShortDate(item.dueDate)}
              {(dueStatus.kind === "overdue" || dueStatus.kind === "today") && (
                <DueBadge status={dueStatus} />
              )}
            </span>
          ) : (
            <span className="text-ink-muted">—</span>
          )}
        </Field>
        <Field icon="tag" label="Tags">
          {item.tags.length > 0 ? (
            <span className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-ink-muted">—</span>
          )}
        </Field>
      </dl>

      <p className="border-t border-line pt-3 text-xs text-ink-muted">
        Created {formatShortDate(item.createdAt.slice(0, 10))} · Last updated{" "}
        {formatShortDate(item.updatedAt.slice(0, 10))}
      </p>
    </div>
  );
}


export function WorkItemDetail(): ReactElement | null {
  const state = useWorkItemsState();
  const itemId = useUrlQuery().get("item");

  if (itemId === null) {
    return null;
  }

  const item = selectItemById(state, itemId);
  const close = (): void => updateUrlQuery((query) => query.delete("item"));

  return (
    <Dialog open onClose={close} ariaLabel="Work item details" className={modalDialogClass}>
      <div className="h-1.5 rounded-t-xl btn-gradient max-sm:rounded-t-xl" aria-hidden="true" />
      <div className="flex flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Work item
          </p>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
            aria-label="Close details"
            onClick={close}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {item !== null ? (
          <DetailBody item={item} />
        ) : state.status === "ready" ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-md font-semibold">Item not found</p>
            <p className="max-w-[36ch] text-sm text-ink-secondary">
              This work item doesn't exist — it may have been removed, or the link is stale.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3" role="status" aria-label="Loading item">
            {[80, 60, 90, 40].map((width, index) => (
              <span
                key={index}
                className="h-3 animate-shimmer rounded-sm bg-[linear-gradient(90deg,var(--color-sunken)_25%,var(--color-line)_50%,var(--color-sunken)_75%)] bg-size-[200%_100%]"
                style={{ width: `${width}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
}
