import type { ReactElement } from "react";
import { Dropdown } from "../../../shared/components/Dropdown";
import { STAGES } from "../constants/workflow";
import { useWorkItemsApi } from "../store/WorkItemsProvider";
import type { Stage, WorkItem } from "../types/work-item";
import { stageStyles } from "./Badges";

const stageOptions = STAGES.map((stage) => ({ value: stage.id, label: stage.label }));


export function StageSelect({ item }: { item: WorkItem }): ReactElement {
  const { moveItemToStage } = useWorkItemsApi();

  return (
    <Dropdown<Stage>
      value={item.stage}
      options={stageOptions}
      ariaLabel={`Stage for "${item.title}"`}
      buttonClassName={`inline-flex items-center gap-1.5 rounded-full border-0 py-0.5 pe-2 ps-2.5 text-xs font-medium transition-shadow hover:shadow-sm max-sm:min-h-9 ${stageStyles[item.stage]}`}
      onChange={(stage) => void moveItemToStage(item, stage)}
    />
  );
}
