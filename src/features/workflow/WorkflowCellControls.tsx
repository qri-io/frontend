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
  sessionId: string
  hide: boolean
}

const WorkflowCellControls: React.FC<WorkflowCellControlsProps> = ({
  index,
  setAnimatedCell,
  sessionId,
  hide=false
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
    <div className={classNames('flex-grow-0 w-48 ml-8 relative pb-11', {
      'opacity-0': hide
    })}>
      <div className='flex flex-col bg-white w-48 rounded-md absolute p-5 pt-2.5 sticky top-20'>
        <WorkflowCellControlButton onClick={onDelete} label='Delete' icon='trashBin'/>
        <WorkflowCellControlButton onClick={onDuplicate} label='Duplicate block' icon='duplicate'/>
        <WorkflowCellControlButton onClick={() => { dispatch(clearWorkflowTransformStepOutput(index)) }} label='Clean output' icon='circleX'/>
        <WorkflowCellControlButton onClick={() => { dispatch(moveWorkflowTransformStepUp(index)) }} label='Move block up' icon='upArrow'/>
        <WorkflowCellControlButton onClick={() => { dispatch(moveWorkflowTransformStepDown(index)) }} flipIcon label='Move block down' icon='upArrow' />
      </div>
    </div>
  )
}

export default WorkflowCellControls;
