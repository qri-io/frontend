import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";

import classNames from 'classnames'
import { RunStep } from '../../qri/run'
import { TransformStep } from '../../qri/dataset'
import CodeEditor from './CodeEditor'
import Output from './output/Output'
import ScrollAnchor from '../scroller/ScrollAnchor'
import WorkflowHeader from './WorkflowHeader'
import WorkflowCellControls from './WorkflowCellControls'
import { selectClearedCells, selectEditedCells } from "./state/workflowState";
import { EventLogLine } from "../../qri/eventLog";

export interface WorkflowCellProps {
  active: boolean
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
  onClick: () => void
}

const WorkflowCell: React.FC<WorkflowCellProps> = ({
  active = false,
  index,
  step,
  run,
  collapseState,
  disabled,
  onChangeScript,
  onRowAdd,
  onRun,
  isCellAdded,
  setAnimatedCell,
  onClick
}) => {
  const { syntax, name, script } = step
  const editedCells = useSelector(selectEditedCells)
  const clearedCells = useSelector(selectClearedCells)
  const [output, setOutput] = useState<EventLogLine[]>(run?.output || [])

  useEffect(() => {
    if ((run?.status === "succeeded" || run?.status === "failed") && run.output) {
      setOutput(run.output)
    } else if ((run?.status === "succeeded" || run?.status === "failed") && !run.output?.length){
      setOutput([])
    }
  }, [ run ])

  const status = run?.status
  const isEdited = editedCells[index]

  let editor: React.ReactElement
  switch (syntax) {
    case 'starlark':
      editor = <CodeEditor
        active={active}
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

  const noColorStatus = !['succeeded', 'running', 'failed'].includes(status)

  let borderStyles
  if (!isEdited) {
    if (status === 'succeeded') {
      borderStyles = 'border-qrigreen'
    } else if (status === 'running') {
      borderStyles = 'border-qrinavy-700 -mb-1'
    } else if (status === 'failed') {
      borderStyles = 'border-dangerred'
    } else if (active) {
      borderStyles = 'border-qritile'
    } else {
      borderStyles = 'border-transparent'
    }
  } else {
    borderStyles = 'border-qritile'
  }

  return (
    <div id={`${name}-cell`} className={`w-full workflow-cell relative  ${isCellAdded && 'animate-appear'}`} onClick={onClick}>
        <ScrollAnchor id={name} />
        <div
          className={classNames(`border rounded-lg ${active && borderStyles}`, {
            'border-transparent': !active
          })}
          style={{
            borderRadius: '0.58rem',
            width: 'calc(100% - 225px)'
          }}
        >
          {/* ^^ this wrapping div allows us to use two different borders.  Active cell shows both, allowing for a thicker border without causing content to shift*/}
          <div
            className={classNames(
              `rounded-lg overflow-hidden flex-grow border box-content`,
              borderStyles,
              {
              'border-transparent hover:border-qrigray-200': !active && (noColorStatus)
              }
            )}
          >
            {(collapseState === 'all' || collapseState === 'only-editor') && editor}
            {(collapseState === 'all' || collapseState === 'only-output') && (output.length > 0 || run?.status === 'running') &&
            !clearedCells[index] &&
            <Output data={output} status={run?.status} wasEdited={editedCells[index]} />}
          </div>
        </div>
        <WorkflowCellControls
          index={index}
          sessionId={run ? run.id : ''}
          setAnimatedCell={setAnimatedCell}
          hide={!active}
        />
      <div
        onClick={() => onRowAdd(index, 'starlark')}
        style={{width: 'calc(100% - 225px)'}}
        className='mt-2 mb-2 cursor-pointer opacity-0 hover:opacity-100 transition-opacity flex items-center'
      >
        <div className='h-px bg-gray-300 flex-grow mr-2' />
        <button className='text-xs border-none flex-shrink-0 bg-white rounded py-1 pr-2 pl-1 font-semibold '>+ Code</button>
      </div>
    </div>
  )
}

export default WorkflowCell
