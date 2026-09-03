import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

export interface DropdownOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

interface DropdownProps<T extends string> {
  readonly value: T;
  readonly options: readonly DropdownOption<T>[];
  readonly onChange: (value: T) => void;
  readonly ariaLabel: string;
  readonly triggerPrefix?: string;
  readonly buttonClassName?: string;
  readonly renderTrigger?: (selected: DropdownOption<T>) => ReactNode;
  readonly align?: "start" | "end";
}

const defaultTriggerClass =
  "inline-flex min-h-10 items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 text-sm text-ink-secondary transition-colors hover:border-line-strong";

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  triggerPrefix = "",
  buttonClassName,
  renderTrigger,
  align = "start",
}: DropdownProps<T>): ReactElement {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((option) => option.value === value) ?? options[0];

  const openList = (): void => {
    const index = options.findIndex((option) => option.value === value);
    setActiveIndex(index >= 0 ? index : 0);
    setOpen(true);
  };

  const select = (next: T): void => {
    setOpen(false);
    if (next !== value) {
      onChange(next);
    }
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent): void => {
      if (rootRef.current !== null && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const active = options[activeIndex];
        if (active !== undefined) select(active.value);
        break;
      }
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative inline-flex min-w-0">
      <button
        type="button"
        className={buttonClassName ?? defaultTriggerClass}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
      >
        <span className="truncate">
          {selected !== undefined
            ? (renderTrigger?.(selected) ?? `${triggerPrefix}${selected.label}`)
            : ""}
        </span>
        <svg
          className={`size-3 shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path
            d="M3 4.5 6 7.5 9 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute top-full z-20 mt-1 max-h-64 w-max min-w-full max-w-64 animate-pop overflow-y-auto rounded-lg border border-line bg-surface py-1.5 shadow-lg ${
            align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          }`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm transition-colors ${
                index === activeIndex ? "bg-accent-subtle text-accent" : "text-ink-secondary"
              }`}
              onPointerEnter={() => setActiveIndex(index)}
              onClick={() => select(option.value)}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && (
                <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3 8.5 6.5 12 13 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
