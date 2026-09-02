import type { ReactElement } from "react";
import { Toolbar } from "../features/filters";
import { WorkItemList, WorkItemsProvider } from "../features/work-items";

export function App(): ReactElement {
  return (
    <WorkItemsProvider>
      <header className="sticky top-0 z-10 border-b border-line bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-304 items-center gap-2 px-4 py-3 md:px-6">
          <span
            className="grid size-6.5 place-items-center rounded-lg bg-linear-to-br from-[#6366f1] to-accent text-white shadow-sm"
            aria-hidden="true"
          >
            <svg viewBox="0 0 16 16" width="13" height="13">
              <path
                d="M2.5 8.5 6 12l7.5-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="text-lg font-semibold tracking-tight">Teamwork</h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-304 p-4 md:px-6">
          <Toolbar />
          <WorkItemList />
        </div>
      </main>
    </WorkItemsProvider>
  );
}
