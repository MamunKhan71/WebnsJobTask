import { useState, type ReactElement } from "react";
import {
  applyView,
  countActiveFilters,
  STAGES,
  useWorkItemsState,
  type Stage,
} from "../../work-items";
import { useListParams } from "../hooks/useListParams";
import { FilterFields } from "./FilterFields";
import { FilterSheet } from "./FilterSheet";
import { SearchInput } from "./SearchInput";
import { StageTabs, type StageCounts } from "./StageTabs";

const clearButtonClass =
  "min-h-9 whitespace-nowrap rounded-sm px-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover hover:underline";

export function Toolbar(): ReactElement {
  const state = useWorkItemsState();
  const {
    params,
    setSearch,
    setStage,
    setAssignee,
    setPriority,
    setOverdueOnly,
    setSort,
    clearFilters,
  } = useListParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const withoutStage = applyView(state.items, { ...params, stage: "all" });
  const byStage = new Map<Stage, number>(
    STAGES.map((stage) => [
      stage.id,
      withoutStage.filter((item) => item.stage === stage.id).length,
    ]),
  );
  const counts: StageCounts = { all: withoutStage.length, byStage };

  const activeCount = countActiveFilters(params);
  const nonStageActive = activeCount - (params.stage !== "all" ? 1 : 0);

  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <SearchInput value={params.search} onChange={setSearch} />

        <div className="hidden lg:block">
          <FilterFields
            params={params}
            layout="inline"
            onAssignee={setAssignee}
            onPriority={setPriority}
            onOverdue={setOverdueOnly}
            onSort={setSort}
          />
        </div>

        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-md border border-line bg-surface px-3 text-sm font-medium text-ink-secondary transition-colors hover:border-line-strong lg:hidden"
          onClick={() => setSheetOpen(true)}
        >
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
            <path
              d="M1.5 3h13M4 8h8M6.5 13h3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          Filters
          {nonStageActive > 0 && (
            <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1.25 text-[11px] font-semibold text-white">
              {nonStageActive}
            </span>
          )}
        </button>
      </div>

      <div className="flex min-w-0 items-center justify-between gap-3">
        <StageTabs value={params.stage} counts={counts} onChange={setStage} />
        {activeCount > 0 && (
          <button type="button" className={clearButtonClass} onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <FilterFields
          params={params}
          layout="stacked"
          onAssignee={setAssignee}
          onPriority={setPriority}
          onOverdue={setOverdueOnly}
          onSort={setSort}
        />
        <div className="mt-6 flex items-center justify-between gap-3">
          {activeCount > 0 && (
            <button
              type="button"
              className={clearButtonClass}
              onClick={() => {
                clearFilters();
                setSheetOpen(false);
              }}
            >
              Clear filters
            </button>
          )}
          <button
            type="button"
            className="min-h-11 flex-1 rounded-md bg-accent text-base font-medium text-white transition-colors hover:bg-accent-hover active:translate-y-px"
            onClick={() => setSheetOpen(false)}
          >
            Done
          </button>
        </div>
      </FilterSheet>
    </div>
  );
}
