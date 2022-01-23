import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"

import classNames from 'classnames'
import { RunStep, RunStatus } from '../../qri/run'
import { TransformStep } from '../../qri/dataset'
import CodeEditor from './CodeEditor'
import Output from './output/Output'
import ScrollAnchor from '../scroller/ScrollAnchor'
import WorkflowHeader from './WorkflowHeader'
import { selectClearedCells, selectEditedCells } from "./state/workflowState"
import { EventLogLine, EventLogLineType } from '../../qri/eventLog'

export interface WorkflowCellProps {
  active: boolean
  index: number
  step: TransformStep
  run?: RunStep
  disabled: boolean
  onChangeScript: (index: number, script: string) => void
  onRun: () => void
  onClick: () => void
}

const WorkflowCell: React.FC<WorkflowCellProps> = ({
  active = false,
  index,
  step,
  run,
  disabled,
  onChangeScript,
  onRun,
  onClick
}) => {
  const { syntax, name, script } = step
  const editedCells = useSelector(selectEditedCells)
  const clearedCells = useSelector(selectClearedCells)
  const [output, setOutput] = useState<EventLogLine[]>(run?.output || [])
  const [lineError, setLineError] = useState<number>(-1)

  useEffect(() => {
    if ((run?.status === "succeeded" || run?.status === "failed") && run.output) {
      setOutput(run.output)
      checkForError(run.output)
    } else if ((run?.status === "succeeded" || run?.status === "failed") && !run.output?.length) {
      setOutput([])
    }
  }, [ run ])

  const checkForError = (data: EventLogLine[]) => {
    // eslint-disable-next-line array-callback-return
    data.map((line) => {
      if (line.type === EventLogLineType.ETError) {
        return findLineWithError(line.data)
      }
    })
  }

  const status = run?.status as RunStatus
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
        standalone={!run?.output || clearedCells[index]}
        lineToReveal={lineError} />
      break
    case 'qri':
      editor = <></>
      break
    case 'heading': // TODO (boandriy): implement when markdown step will be introduced on BE
      editor = <WorkflowHeader title={script} onChange={(v) => { onChangeScript(index, v) }} />
      break
    default:
      editor = <p>unknown editor for &apos;{syntax}&apos; workflow step</p>
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

  const scrollToError = () => {
    const editor = document.getElementById('download-example-cell')
    editor?.scrollIntoView({ behavior: 'smooth' })
  }

  const findLineWithError = (error: Record<string, any>) => {
    const searchQuery = '.star:'
    const fromIndex = +error.msg.indexOf(searchQuery) + searchQuery.length
    const toIndex = error.msg.indexOf(':', fromIndex)
    const lineNumber = +error.msg.slice(fromIndex, toIndex)
    setLineError(lineNumber)
  }

  return (
    <div id={`${name}-cell`} className={`w-full workflow-cell relative`} onClick={onClick}>
      <ScrollAnchor id={name} />
      <div
          className={classNames(`border rounded-lg w-full ${active && borderStyles}`, {
            'border-transparent': !active
          })}
          style={{
            borderRadius: 7
          }}
        >
        {/* ^^ this wrapping div allows us to use two different borders.  Active cell shows both, allowing for a thicker border without causing content to shift */}
        <div
            className={classNames(
              `rounded-lg overflow-hidden flex-grow border box-content`,
              borderStyles,
              {
                'border-transparent hover:border-qrigray-200': !active && (noColorStatus)
              }
            )}
          >
          {editor}
          {(output.length > 0 || run?.status === 'running') &&
            !clearedCells[index] &&
            <Output data={output} status={run?.status} wasEdited={editedCells[index]} scrollToError={scrollToError} />}
        </div>
      </div>
    </div>
  )
}

export default WorkflowCell
