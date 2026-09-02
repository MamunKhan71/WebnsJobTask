import { useEffect, useRef, type ReactElement, type ReactNode } from "react";

export function FilterSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85dvh] w-full max-w-full overflow-y-auto rounded-t-lg border-0 bg-surface p-0 shadow-lg backdrop:bg-[rgb(16_24_40/0.45)] backdrop:animate-fade-in open:animate-slide-up"
      aria-label="Filter and sort"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="mx-auto mb-1 mt-3 h-1 w-9 rounded-full bg-line-strong" aria-hidden="true" />
      <div className="px-5 pb-8 pt-4">{children}</div>
    </dialog>
  );
}
