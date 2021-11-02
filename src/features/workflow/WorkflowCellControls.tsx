import React from "react"
import classNames from 'classnames'
import { useDispatch } from "react-redux"

import {
  clearWorkflowTransformStepOutput,
  duplicateWorkflowTransformStep,
  moveWorkflowTransformStepDown,
  moveWorkflowTransformStepUp,
  removeWorkflowTransformStep
} from './state/workflowActions';
import WorkflowCellControlButton from "./WorkflowCellControlButton";


interface WorkflowCellControlsProps {
  index: number
  setAnimatedCell: (i:number) => void
  hide: boolean
  canBeDeleted: boolean
}

const WorkflowCellControls: React.FC<WorkflowCellControlsProps> = ({
  index,
  setAnimatedCell,
  hide=false,
  canBeDeleted
}) => {
  const dispatch = useDispatch()

  const onDelete = () => {
    setAnimatedCell(-1)
    dispatch(removeWorkflowTransformStep(index))
  }

  const onDuplicate = () => {
    setAnimatedCell(index+1)
    dispatch(duplicateWorkflowTransformStep(index))
  }

  return (
    <div className={classNames('flex-grow-0 w-48 ml-8 absolute top-0 right-0 bottom-0 pb-8', {
      'opacity-0': hide
    })}>
      <div className='flex flex-col bg-white w-48 rounded-md absolute p-5 pt-2.5 sticky top-20'>
        <WorkflowCellControlButton disabled={!canBeDeleted} onClick={onDelete} label='Delete' icon='trashBin'/>
        <WorkflowCellControlButton onClick={onDuplicate} label='Duplicate block' icon='duplicate'/>
        <WorkflowCellControlButton onClick={() => { dispatch(clearWorkflowTransformStepOutput(index)) }} label='Clean output' icon='circleX'/>
        <WorkflowCellControlButton onClick={() => { dispatch(moveWorkflowTransformStepUp(index)) }} label='Move block up' icon='upArrow'/>
        <WorkflowCellControlButton onClick={() => { dispatch(moveWorkflowTransformStepDown(index)) }} flipIcon label='Move block down' icon='upArrow' />
      </div>
    </div>
  )
}

export default WorkflowCellControls;
