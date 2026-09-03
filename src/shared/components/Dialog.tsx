import { useEffect, useRef, type ReactElement, type ReactNode } from "react";

export const modalDialogClass =
  "m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border-0 bg-surface p-0 shadow-lg backdrop:bg-[rgb(16_24_40/0.45)] backdrop:animate-fade-in open:animate-pop max-sm:bottom-0 max-sm:top-auto max-sm:mb-0 max-sm:w-full max-sm:max-w-full max-sm:rounded-b-none";

export const sheetDialogClass =
  "fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85dvh] w-full max-w-full overflow-y-auto rounded-t-xl border-0 bg-surface p-0 shadow-lg backdrop:bg-[rgb(16_24_40/0.45)] backdrop:animate-fade-in open:animate-slide-up";

interface DialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly className: string;
  readonly ariaLabel: string;
  readonly children: ReactNode;
}

export function Dialog({
  open,
  onClose,
  className,
  ariaLabel,
  children,
}: DialogProps): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={className}
      aria-label={ariaLabel}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      {children}
    </dialog>
  );
}
