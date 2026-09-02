import { useEffect, type ReactElement } from "react";
import { updateUrlQuery, useUrlQuery } from "../../../shared/hooks/useUrlQuery";
import { useWorkItemsApi, useWorkItemsState } from "../store/WorkItemsProvider";
import { applyView } from "../utils/apply-view";
import { PAGE_SIZE, parseListParams } from "../utils/view-params";
import { Pagination } from "./Pagination";
import { WorkItemRow } from "./WorkItemRow";

const SKELETON_ROWS = 8;

const panelClass = "overflow-hidden rounded-lg border border-line bg-surface shadow-sm";
const stateBoxClass = "flex flex-col items-center gap-2 px-6 py-10 text-center";
const stateTitleClass = "text-md font-semibold";
const stateBodyClass = "max-w-[44ch] text-sm text-ink-secondary";
const primaryButtonClass =
  "mt-3 min-h-11 rounded-md bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:translate-y-px";

function LoadingState(): ReactElement {
  return (
    <div role="status" aria-label="Loading work items" className={panelClass}>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div
          key={index}
          className="flex min-h-13 items-center justify-between gap-4 border-b border-line p-4 last:border-b-0"
          aria-hidden="true"
        >
          <span
            className="h-3 animate-shimmer rounded-sm bg-[linear-gradient(90deg,var(--color-sunken)_25%,var(--color-line)_50%,var(--color-sunken)_75%)] bg-size-[200%_100%]"
            style={{ width: `${45 + ((index * 17) % 40)}%` }}
          />
          <span className="h-3 w-28 animate-shimmer rounded-sm bg-[linear-gradient(90deg,var(--color-sunken)_25%,var(--color-line)_50%,var(--color-sunken)_75%)] bg-size-[200%_100%]" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): ReactElement {
  return (
    <div role="alert" className={`${panelClass} ${stateBoxClass}`}>
      <p className={stateTitleClass}>Couldn't load the work list</p>
      <p className={stateBodyClass}>{message}</p>
      <button type="button" className={primaryButtonClass} onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }): ReactElement {
  if (!filtered) {
    return (
      <div className={`${panelClass} ${stateBoxClass}`}>
        <p className={stateTitleClass}>No work items yet</p>
        <p className={stateBodyClass}>
          Everything the team is working on will show up here. Add the first item to get
          started.
        </p>
      </div>
    );
  }
  return (
    <div className={`${panelClass} ${stateBoxClass}`}>
      <p className={stateTitleClass}>Nothing matches these filters</p>
      <p className={stateBodyClass}>
        No work items match the current search and filters. Loosen one, or clear them all.
      </p>
      <button
        type="button"
        className={primaryButtonClass}
        onClick={() =>
          updateUrlQuery((query) => {
            for (const key of ["q", "stage", "assignee", "priority", "overdue", "page"]) {
              query.delete(key);
            }
          })
        }
      >
        Clear search & filters
      </button>
    </div>
  );
}

export function WorkItemList(): ReactElement {
  const state = useWorkItemsState();
  const { loadItems } = useWorkItemsApi();
  const params = parseListParams(useUrlQuery());

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  if (state.status === "loading" || state.status === "idle") {
    return <LoadingState />;
  }
  if (state.status === "error") {
    return (
      <ErrorState
        message={state.errorMessage ?? "Something went wrong."}
        onRetry={() => void loadItems()}
      />
    );
  }

  const visible = applyView(state.items, params);
  if (visible.length === 0) {
    return <EmptyState filtered={state.items.length > 0} />;
  }

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const page = Math.min(params.page, pageCount);
  const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (next: number): void => {
    updateUrlQuery((query) => {
      if (next === 1) {
        query.delete("page");
      } else {
        query.set("page", String(next));
      }
    });
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <div className={panelClass}>
        <div
          className="hidden gap-3 border-b border-line bg-sunken px-4 py-2 ps-4.75 text-xs font-semibold uppercase tracking-wider text-ink-muted md:grid md:grid-cols-[minmax(0,1fr)_200px_72px_104px_108px]"
          aria-hidden="true"
        >
          <span>Title</span>
          <span>Assignee</span>
          <span>Priority</span>
          <span>Due</span>
          <span>Stage</span>
        </div>
        <ul key={`${page}-${params.sort}-${params.stage}`}>
          {pageItems.map((item, index) => (
            <WorkItemRow key={item.id} item={item} index={index} />
          ))}
        </ul>
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        totalItems={visible.length}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </>
  );
}
