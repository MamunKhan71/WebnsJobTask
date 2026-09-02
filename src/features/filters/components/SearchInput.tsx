import { useEffect, useRef, useState, type ReactElement } from "react";

const DEBOUNCE_MS = 250;

export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}): ReactElement {
  const [draft, setDraft] = useState(value);
  const timer = useRef<number | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(value);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const commit = (next: string): void => {
    setDraft(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onChange(next), DEBOUNCE_MS);
  };

  return (
    <div className="relative flex min-w-0 flex-1 items-center">
      <svg
        className="pointer-events-none absolute left-3 size-4 text-ink-muted"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        className="min-h-10 w-full rounded-md border border-line bg-surface pe-8 ps-9 text-base transition-[border-color,box-shadow] placeholder:text-ink-muted hover:border-line-strong focus:border-focus focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        placeholder="Search by title, person, or tag…"
        aria-label="Search work items"
        value={draft}
        onChange={(event) => commit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && draft !== "") {
            event.stopPropagation();
            commit("");
          }
        }}
      />
      {draft !== "" && (
        <button
          type="button"
          className="absolute right-1 grid size-8 place-items-center rounded-sm text-lg leading-none text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
          aria-label="Clear search"
          onClick={() => {
            commit("");
            inputRef.current?.focus();
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
