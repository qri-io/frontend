import React from 'react'
import { RunStep } from '../../qri/run'
import { TransformStep } from '../../qri/dataset'
import CodeEditor from './CodeEditor'
import Output from './output/Output'
import ScrollAnchor from '../scroller/ScrollAnchor'
import WorkflowHeader from './WorkflowHeader'
import WorkflowCellControls from './WorkflowCellControls'
import { useSelector } from "react-redux";
import { selectClearedCells, selectEditedCells } from "./state/workflowState";

export interface WorkflowCellProps {
  index: number
  step: TransformStep
  run?: RunStep
  disabled: boolean
  collapseState: 'collapsed' | 'only-editor' | 'only-output' | 'all'
  onChangeCollapse: (v: 'collapsed' | 'only-editor' | 'only-output' | 'all') => void
  onChangeScript: (index: number, script: string) => void
  onRun: () => void
  setAnimatedCell: (i: number) => void
  isCellAdded: boolean
  onRowAdd: (index: number, syntax: string) => void
}

const WorkflowCell: React.FC<WorkflowCellProps> = ({
  index,
  step,
  run,
  collapseState,
  disabled,
  onChangeScript,
  onRowAdd,
  onRun,
  isCellAdded,
  setAnimatedCell
}) => {
  const { syntax, name, script } = step
  const editedCells = useSelector(selectEditedCells)
  const clearedCells = useSelector(selectClearedCells)

  let editor: React.ReactElement
  switch (syntax) {
    case 'starlark':
      editor = <CodeEditor
        isEdited={editedCells[index]}
        status={run?.status}
        script={script}
        onChange={(v) => { onChangeScript(index, v) }}
        onRun={onRun}
        disabled={disabled}
        standalone={!run?.output || clearedCells[index]} />
      break;
    case 'qri':
      editor = <></>
      break
    case 'heading': // TODO (boandriy): implement when markdown step will be introduced on BE
      editor = <WorkflowHeader title={script} onChange={(v) => { onChangeScript(index, v) }} />
      break
    default:
      editor = <p>unknown editor for '{syntax}' workflow step</p>
  }

  return (
    <div id={`${name}-cell`} className={`w-full workflow-cell flex ${isCellAdded && 'animate-appear'}`}>
      <div className='flex-grow min-w-0'>
        <ScrollAnchor id={name} />
        <div className='group'>
          {(collapseState === 'all' || collapseState === 'only-editor') && editor}
          {(collapseState === 'all' || collapseState === 'only-output') && (run?.output || run?.status === 'running') &&
          !clearedCells[index] &&
          <Output data={run?.output} status={run?.status} wasEdited={editedCells[index]} />}
        </div>
        <div
          onClick={() => onRowAdd(index, 'starlark')}
          className='mt-2 mb-2 cursor-pointer opacity-0 hover:opacity-100 transition-opacity flex items-center'
        >
          <div className='h-px bg-gray-300 flex-grow mr-2' />
          <button className='text-xs border-none flex-shrink-0 bg-white rounded py-1 pr-2 pl-1 font-semibold '>+ Code</button>
        </div>
      </div>
      <WorkflowCellControls index={index} sessionId={run ? run.id : ''} setAnimatedCell={setAnimatedCell} />
    </div>
  )
}

export default WorkflowCell
