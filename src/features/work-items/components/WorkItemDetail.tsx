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

const fieldLabelClass = "text-xs font-semibold uppercase tracking-wider text-ink-muted";

function Field({ label, children }: { label: string; children: ReactNode }): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <dt className={fieldLabelClass}>{label}</dt>
      <dd className="text-sm text-ink-secondary">{children}</dd>
    </div>
  );
}

function DetailBody({ item }: { item: WorkItem }): ReactElement {
  const person = selectPerson(item.assigneeId);
  const dueStatus = getDueStatus(item.dueDate, item.stage === "done");
  const priorityLabel = PRIORITIES.find((p) => p.id === item.priority)?.label ?? item.priority;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <StageSelect item={item} />
        <span className="text-xs tabular-nums text-ink-muted">{item.id}</span>
      </div>

      <h2 className="text-lg font-semibold leading-snug">{item.title}</h2>

      {item.description !== null ? (
        <p className="text-sm leading-relaxed text-ink-secondary">{item.description}</p>
      ) : (
        <p className="text-sm italic text-ink-muted">No description.</p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
        <Field label="Assignee">
          <Assignee person={person} />
        </Field>
        <Field label="Priority">
          {item.priority === "high" || item.priority === "urgent" ? (
            <PriorityBadge priority={item.priority} />
          ) : (
            priorityLabel
          )}
        </Field>
        <Field label="Due date">
          {item.dueDate !== null ? (
            <span className="inline-flex items-center gap-2">
              {formatShortDate(item.dueDate)}
              <DueBadge status={dueStatus.kind === "upcoming" ? { kind: "none" } : dueStatus} />
            </span>
          ) : (
            "—"
          )}
        </Field>
        <Field label="Tags">
          {item.tags.length > 0 ? (
            <span className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-sunken px-2 py-0.5 text-xs text-ink-secondary"
                >
                  {tag}
                </span>
              ))}
            </span>
          ) : (
            "—"
          )}
        </Field>
        <Field label="Created">{formatShortDate(item.createdAt.slice(0, 10))}</Field>
        <Field label="Updated">{formatShortDate(item.updatedAt.slice(0, 10))}</Field>
      </dl>
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
    <Dialog
      open
      onClose={close}
      ariaLabel="Work item details"
      className={modalDialogClass}
    >
      <div className="flex flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className={fieldLabelClass}>Work item</p>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
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
