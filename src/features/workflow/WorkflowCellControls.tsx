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
import { showModal } from "../app/state/appActions";
import { ModalType } from "../app/state/appState";


interface WorkflowCellControlsProps {
  index: number
  setAnimatedCell: (i:number) => void
}

const WorkflowCellControls: React.FC<WorkflowCellControlsProps> = ({
  index,
  setAnimatedCell
}) => {
  const dispatch = useDispatch()

  const onDelete = () => {
    setAnimatedCell(-1)
    dispatch(removeWorkflowTransformStep(index))
  }

  const openDeleteModal = () => {
    dispatch(showModal(ModalType.cellDelete, {
      action: onDelete
    }))
  }

  const onDuplicate = () => {
    setAnimatedCell(index+1)
    dispatch(duplicateWorkflowTransformStep(index))
  }

  return (
    <div className={'group-hover:opacity-100 flex-grow-0 w-48 ml-8 opacity-0 transition-opacity relative'}>
      <div className={'flex flex-col bg-white w-48 rounded-md absolute p-5 pt-2.5'}>
        <WorkflowCellControlButton onClick={openDeleteModal} label='Delete' icon='trashBin'/>
        <WorkflowCellControlButton onClick={onDuplicate} label='Duplicate block' icon='duplicate'/>
        <WorkflowCellControlButton onClick={() => { dispatch(clearOutputWorkflowTransformStep(index)) }} label='Clean output' icon='circleX'/>
        <WorkflowCellControlButton onClick={() => { dispatch(moveWorkflowTransformStepUp(index)) }} label='Move block up' icon='upArrow'/>
        <WorkflowCellControlButton onClick={() => { dispatch(moveWorkflowTransformStepDown(index)) }} flipIcon label='Move block down' icon='upArrow' />
      </div>
    </div>
  )
}

export default WorkflowCellControls;
