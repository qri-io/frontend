import React from "react";
import { useDispatch } from "react-redux";

import {
  clearOutputWorkflowTransformStep,
  duplicateWorkflowTransformStep,
  moveWorkflowTransformStepDown,
  moveWorkflowTransformStepUp,
  removeWorkflowTransformStep
} from './state/workflowActions';
import WorkflowCellControlButton from "./WorkflowCellControlButton";


interface WorkflowCellControlsProps {
  index: number
}

const WorkflowCellControls: React.FC<WorkflowCellControlsProps> = ({
  index
}) => {
  const dispatch = useDispatch()

  return (
    <div className={'group-hover:opacity-100 flex-grow-0 w-48 ml-8 opacity-0 transition-opacity relative'}>
      <div className={'flex flex-col bg-white w-48 rounded-md absolute p-5 pt-2.5'}>
        <WorkflowCellControlButton onClick={() => { dispatch(removeWorkflowTransformStep(index)) }} label='Delete' icon='trashBin'/>
        <WorkflowCellControlButton onClick={() => { dispatch(duplicateWorkflowTransformStep(index)) }} label='Duplicate block' icon='duplicate'/>
        <WorkflowCellControlButton onClick={() => { dispatch(clearOutputWorkflowTransformStep(index)) }} label='Clean output' icon='circleX'/>
        <WorkflowCellControlButton onClick={() => { dispatch(moveWorkflowTransformStepUp(index)) }} label='Move block up' icon='upArrow'/>
        <WorkflowCellControlButton onClick={() => { dispatch(moveWorkflowTransformStepDown(index)) }} flipIcon label='Move block down' icon='upArrow' />
      </div>
    </div>
  )
}

export default WorkflowCellControls;
