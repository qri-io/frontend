import React from 'react'
import { RunStep } from '../../qrimatic/run'
import { WorkflowStep } from '../../qrimatic/workflow'
import CodeEditor from './CodeEditor'
import Output from './Output'
import RunStateIcon from './RunStateIcon'

export interface WorkflowCellProps {
  index: number
  step: WorkflowStep
  run?: RunStep

  collapseState: 'collapsed' | 'only-editor' | 'only-output' | 'all'
  onChangeCollapse: (v: 'collapsed' | 'only-editor' | 'only-output' | 'all') => void
  onChangeValue: (index: number, v: string) => void
}

const WorkflowCell: React.FC<WorkflowCellProps> = ({ 
  index,
  step,
  run,
  collapseState,
  onChangeCollapse,
  onChangeValue,
}) => {
  const { type, name, value } = step

  let editor: React.ReactElement
  switch (type) {
    case 'starlark':
      editor = <CodeEditor value={value} onChange={(v) => { onChangeValue(index, v) }} disabled={!!run} />
      break;
    case 'save':
      editor = <></>
      break;
    default:
      editor = <p>unknown editor for '{type}' workflow step</p>
  }

  return (
    <div className='w-full py-5'>
      {run && <RunStateIcon state={run.status} />}
      {run && <p className='float-right'>{run.duration}</p>}
      <h3 className='text-xl text-gray-500 font-semibold mb-2 cursor-pointer' onClick={() => {
        onChangeCollapse(collapseState === 'all' ? 'collapsed' : 'all')
      }}>{name}</h3>
      {(collapseState === 'all' || collapseState === 'only-editor') && editor}
      {run && (collapseState === 'all' || collapseState === 'only-output') && <Output data={run.output} />}
    </div>
  )
}

export default WorkflowCell
