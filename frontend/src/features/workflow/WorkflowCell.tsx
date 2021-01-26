import React from 'react'
import { RunStep } from '../../qrimatic/run'
import { TransformStep } from '../../qrimatic/workflow'
import CodeEditor from './CodeEditor'
import Output from './output/Output'
import RunStateIcon from './RunStateIcon'

export interface WorkflowCellProps {
  index: number
  step: TransformStep
  run?: RunStep

  collapseState: 'collapsed' | 'only-editor' | 'only-output' | 'all'
  onChangeCollapse: (v: 'collapsed' | 'only-editor' | 'only-output' | 'all') => void
  onChangeValue: (index: number, v: string) => void
}

const nameLookup = (name: string) => {
  switch(name) {
    case 'setup':
      return 'Import dependencies or load existing qri datasets'
    case 'download':
      return 'Pull in data from external sources like websites, APIs, or databases'
    case 'transform':
      return 'Shape your data into the desired output for your dataset'
    case 'save':
      return 'Saving will commit changes to your qri dataset after running the code above. You can preview the changes here after each dry run of the workflow'
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
  const { syntax, name, script } = step
  const description = nameLookup(name)

  let editor: React.ReactElement
  switch (syntax) {
    case 'starlark':
      editor = <CodeEditor script={script} onChange={(v) => { onChangeValue(index, v) }} disabled={!!run} />
      break;
    case 'save':
      editor = <></>
      break;
    default:
      editor = <p>unknown editor for '{syntax}' workflow step</p>
  }

  return (
    <div className='w-full rounded border-gray-200 border-2 my-4'>
      <header>
        <div className='text-center w-10 h-100 py-3 float-left'>
          <h1 className='font-black text-3xl text-gray-300' >{index + 1}</h1>
        </div>
        <div className='py-2 px-5'>
          {run && <p className='float-right'>{run.duration}</p>}
          <h3 className='text-lg text-gray-500 font-semibold cursor-pointer' onClick={() => {
            onChangeCollapse(collapseState === 'all' ? 'collapsed' : 'all')
          }}>{name}{run && <RunStateIcon state={run.status} />}</h3>
          <div className='text-xs mb-2'>{description}</div>
        </div>
      </header>
      {(collapseState === 'all' || collapseState === 'only-editor') && editor}
      {(collapseState === 'all' || collapseState === 'only-output') && <Output data={run?.output} />}
    </div>
  )
}

export default WorkflowCell
