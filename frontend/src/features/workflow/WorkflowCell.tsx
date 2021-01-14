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

const nameLookup = (name: string) => {
  switch(name) {
    case 'setup':
      return 'Use the setup block to import dependencies or load existing qri datasets'
    case 'download':
      return 'Use the download step to pull in data from external sources like websites, APIs, or databases'
    case 'transform':
      return 'Use the transform step to shape your data into the desired output for your dataset'
    case 'save':
      return 'The save step will commit changes to your qri dataset after running the code above. You can preview the changes here after each dry run of the workflow'
    default:
      return ''
  }
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

  const description = nameLookup(name)

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
      {run && <p className='float-right'>{run.duration}</p>}
      <h3 className='text-xl text-gray-500 font-semibold mb-1 cursor-pointer' onClick={() => {
        onChangeCollapse(collapseState === 'all' ? 'collapsed' : 'all')
      }}>{index + 1}) {name}{run && <RunStateIcon state={run.status} />}</h3>
      <div className='text-xs mb-2'>{description}</div>
      {(collapseState === 'all' || collapseState === 'only-editor') && editor}
      {run && (collapseState === 'all' || collapseState === 'only-output') && <Output data={run.output} />}
      {!run && <Output />}
    </div>
  )
}

export default WorkflowCell
