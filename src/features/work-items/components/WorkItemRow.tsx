import type { ReactElement } from "react";
import { selectPerson } from "../store/selectors";
import type { WorkItem } from "../types/work-item";
import { getDueStatus } from "../utils/dates";
import { Assignee } from "./Assignee";
import { DueBadge, PriorityBadge, StageBadge } from "./Badges";

const rowGridMobile = "[grid-template-areas:'title''meta''assignee']";
const rowGridDesktop =
  "md:[grid-template-areas:'title_assignee_priority_due_stage'] md:grid-cols-[minmax(0,1fr)_200px_72px_104px_108px]";

export function WorkItemRow({
  item,
  index,
}: {
  item: WorkItem;
  index: number;
}): ReactElement {
  const person = selectPerson(item.assigneeId);
  const dueStatus = getDueStatus(item.dueDate, item.stage === "done");

  return (
    <li
      className={`relative grid animate-row-in gap-2 border-b border-line border-s-[3px] border-s-transparent bg-surface px-4 py-3 transition-colors last:border-b-0 hover:bg-[#f8f9fb] data-[priority=high]:border-s-[#d97706] data-[priority=urgent]:border-s-danger md:min-h-13 md:items-center md:gap-3 md:py-2 ${rowGridMobile} ${rowGridDesktop}`}
      data-priority={item.priority}
      style={{ animationDelay: `${Math.min(index, 16) * 24}ms` }}
    >
      <p
        className="line-clamp-2 text-base font-medium leading-tight [grid-area:title] md:line-clamp-1"
        title={item.title}
      >
        {item.title}
      </p>
      <div className="flex flex-wrap items-center gap-2 [grid-area:meta] md:contents">
        <span className="inline-flex items-center md:[grid-area:priority]">
          <PriorityBadge priority={item.priority} />
        </span>
        <span className="inline-flex items-center md:[grid-area:due]">
          <DueBadge status={dueStatus} />
        </span>
        <span className="-order-1 inline-flex items-center md:order-0 md:[grid-area:stage]">
          <StageBadge stage={item.stage} />
        </span>
      </div>
      <span className="flex min-w-0 [grid-area:assignee]">
        <Assignee person={person} />
      </span>
    </li>
  );
}
