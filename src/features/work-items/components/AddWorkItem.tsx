import { useState, type FormEvent, type ReactElement } from "react";
import { Dialog, modalDialogClass } from "../../../shared/components/Dialog";
import { Dropdown, type DropdownOption } from "../../../shared/components/Dropdown";
import { updateUrlQuery } from "../../../shared/hooks/useUrlQuery";
import { PRIORITIES, STAGES } from "../constants/workflow";
import { PEOPLE } from "../data/people";
import { useWorkItemsApi } from "../store/WorkItemsProvider";
import type { Priority, Stage } from "../types/work-item";

const labelClass = "text-xs font-semibold uppercase tracking-wider text-ink-muted";
const controlClass =
  "min-h-10 w-full rounded-md border border-line bg-surface px-3 text-base text-ink transition-colors hover:border-line-strong focus:border-focus focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] focus:outline-none";
const dropdownTriggerClass =
  "inline-flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 text-base text-ink transition-colors hover:border-line-strong";

const stageOptions: readonly DropdownOption<Stage>[] = STAGES.map((stage) => ({
  value: stage.id,
  label: stage.label,
}));
const priorityOptions: readonly DropdownOption<Priority>[] = PRIORITIES.map((priority) => ({
  value: priority.id,
  label: priority.label,
}));
const assigneeOptions: readonly DropdownOption<string>[] = [
  { value: "", label: "Unassigned" },
  ...PEOPLE.map((person) => ({ value: person.id, label: person.name })),
];

interface FormState {
  readonly title: string;
  readonly description: string;
  readonly stage: Stage;
  readonly priority: Priority;
  readonly assigneeId: string;
  readonly dueDate: string;
}

const emptyForm: FormState = {
  title: "",
  description: "",
  stage: "backlog",
  priority: "medium",
  assigneeId: "",
  dueDate: "",
};

export function AddWorkItemButton(): ReactElement {
  const { addItem } = useWorkItemsApi();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (changes: Partial<FormState>): void => setForm((prev) => ({ ...prev, ...changes }));

  const close = (): void => {
    if (pending) return;
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const title = form.title.trim();
    if (title === "" || pending) return;

    setPending(true);
    setError(null);
    try {
      const created = await addItem({
        title,
        description: form.description.trim() === "" ? null : form.description.trim(),
        stage: form.stage,
        priority: form.priority,
        assigneeId: form.assigneeId === "" ? null : form.assigneeId,
        dueDate: form.dueDate === "" ? null : form.dueDate,
        tags: [],
      });
      setForm(emptyForm);
      setOpen(false);
      updateUrlQuery((query) => query.set("item", created.id));
    } catch {
      setError("Couldn't save the item. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="ms-auto inline-flex min-h-10 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover active:translate-y-px"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="max-sm:sr-only">Add work</span>
      </button>

      <Dialog
        open={open}
        onClose={close}
        ariaLabel="Add work item"
        className={modalDialogClass}
      >
        <form className="flex flex-col gap-4 p-5" onSubmit={(event) => void handleSubmit(event)}>
          <div className="flex items-center justify-between">
            <h2 className="text-md font-semibold">Add work</h2>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-md text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
              aria-label="Close"
              onClick={close}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <label className="flex flex-col gap-1">
            <span className={labelClass}>Title</span>
            <input
              className={controlClass}
              value={form.title}
              onChange={(event) => patch({ title: event.target.value })}
              placeholder="What needs doing?"
              required
              maxLength={300}
              data-autofocus
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className={labelClass}>Description (optional)</span>
            <textarea
              className={`${controlClass} min-h-20 resize-y py-2`}
              value={form.description}
              onChange={(event) => patch({ description: event.target.value })}
              rows={3}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Stage</span>
              <Dropdown
                value={form.stage}
                options={stageOptions}
                ariaLabel="Stage"
                buttonClassName={dropdownTriggerClass}
                onChange={(stage) => patch({ stage })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClass}>Priority</span>
              <Dropdown
                value={form.priority}
                options={priorityOptions}
                ariaLabel="Priority"
                buttonClassName={dropdownTriggerClass}
                onChange={(priority) => patch({ priority })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClass}>Assignee</span>
              <Dropdown
                value={form.assigneeId}
                options={assigneeOptions}
                ariaLabel="Assignee"
                buttonClassName={dropdownTriggerClass}
                onChange={(assigneeId) => patch({ assigneeId })}
              />
            </div>

            <label className="flex flex-col gap-1">
              <span className={labelClass}>Due date</span>
              <input
                type="date"
                className={controlClass}
                value={form.dueDate}
                onChange={(event) => patch({ dueDate: event.target.value })}
              />
            </label>
          </div>

          {error !== null && (
            <p role="alert" className="rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              className="min-h-10 rounded-md border border-line bg-surface px-4 text-sm font-medium text-ink-secondary transition-colors hover:border-line-strong disabled:opacity-50"
              onClick={close}
              disabled={pending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-10 rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:translate-y-px disabled:opacity-50"
              disabled={pending || form.title.trim() === ""}
            >
              {pending ? "Adding…" : "Add item"}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
