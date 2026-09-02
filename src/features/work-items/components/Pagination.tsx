import type { ReactElement } from "react";

interface PaginationProps {
  readonly page: number;
  readonly pageCount: number;
  readonly totalItems: number;
  readonly pageSize: number;
  readonly onPageChange: (page: number) => void;
}

function getPageItems(page: number, pageCount: number): readonly (number | "gap")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  let previous = 0;
  for (const p of sorted) {
    if (p - previous > 1) {
      items.push("gap");
    }
    items.push(p);
    previous = p;
  }
  return items;
}

const pageButtonClass =
  "inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-2 text-sm tabular-nums text-ink-secondary transition-colors enabled:hover:border-line enabled:hover:bg-surface enabled:active:translate-y-px disabled:opacity-40 aria-[current=page]:border-accent aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-white max-sm:min-h-11 max-sm:min-w-11 max-sm:border-line max-sm:bg-surface";

export function Pagination({
  page,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps): ReactElement | null {
  if (pageCount <= 1) {
    return null;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <nav className="mt-4 flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
      <p className="text-sm tabular-nums text-ink-muted">
        Showing{" "}
        <strong className="font-medium text-ink-secondary">
          {from}–{to}
        </strong>{" "}
        of <strong className="font-medium text-ink-secondary">{totalItems}</strong>
      </p>

      <div className="ms-auto flex items-center gap-1">
        <button
          type="button"
          className={pageButtonClass}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹<span className="hidden sm:inline">&nbsp;Prev</span>
        </button>

        <span className="px-2 text-sm tabular-nums text-ink-secondary sm:hidden" aria-hidden="true">
          {page} / {pageCount}
        </span>

        <span className="hidden items-center gap-1 sm:inline-flex">
          {getPageItems(page, pageCount).map((item, index) =>
            item === "gap" ? (
              <span key={`gap-${index}`} className="px-1 text-ink-muted" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={pageButtonClass}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ),
          )}
        </span>

        <button
          type="button"
          className={pageButtonClass}
          disabled={page === pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="hidden sm:inline">Next&nbsp;</span>›
        </button>
      </div>
    </nav>
  );
}
