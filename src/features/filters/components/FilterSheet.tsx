import type { ReactElement, ReactNode } from "react";
import { Dialog, sheetDialogClass } from "../../../shared/components/Dialog";

export function FilterSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}): ReactElement {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      ariaLabel="Filter and sort"
      className={sheetDialogClass}
    >
      <div className="mx-auto mb-1 mt-3 h-1 w-9 rounded-full bg-line-strong" aria-hidden="true" />
      <div className="px-5 pb-8 pt-4">{children}</div>
    </Dialog>
  );
}
