import React from "react";

import WorkflowCellControlButton from "./WorkflowCellControlButton";

interface WorkflowCellControlsProps {
  onDelete: () => void
  onDuplicate: () => void
  onOutputClear: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

const WorkflowCellControls: React.FC<WorkflowCellControlsProps> = ({
  onDelete,
  onDuplicate,
  onOutputClear,
  onMoveUp,
  onMoveDown
}) => {

  return (
    <div className={'group-hover:opacity-100 flex-grow-0 w-48 ml-8 opacity-0 transition-opacity relative'}>
      <div className={'flex flex-col bg-white w-48 rounded-md absolute p-5 pt-2.5'}>
        <WorkflowCellControlButton onClick={onDelete} label='Delete' icon='trashBin'/>
        <WorkflowCellControlButton onClick={onDuplicate} label='Duplicate block' icon='duplicate'/>
        <WorkflowCellControlButton onClick={onOutputClear} label='Clean output' icon='circleX'/>
        <WorkflowCellControlButton onClick={onMoveUp} label='Move block up' icon='upArrow'/>
        <WorkflowCellControlButton onClick={onMoveDown} rotate={true} label='Move block down' icon='upArrow' />
      </div>
    </div>
  )
}

export default WorkflowCellControls;
