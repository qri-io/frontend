import React from 'react'
import { RunStep } from '../../qri/run'
import { TransformStep } from '../../qri/dataset'
import CodeEditor from './CodeEditor'
import Output from './output/Output'
import RunStatusIcon from '../run/RunStatusIcon'
import ScrollAnchor from '../scroller/ScrollAnchor'

export interface WorkflowCellProps {
  index: number
  step: TransformStep
  run?: RunStep

  collapseState: 'collapsed' | 'only-editor' | 'only-output' | 'all'
  onChangeCollapse: (v: 'collapsed' | 'only-editor' | 'only-output' | 'all') => void
  onChangeScript: (index: number, script: string) => void
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
  onChangeScript,
}) => {
  const { syntax, name, script } = step
  const description = nameLookup(name)

  let editor: React.ReactElement
  switch (syntax) {
    case 'starlark':
      editor = <CodeEditor script={script} onChange={(v) => { onChangeScript(index, v) }} disabled={!!run} standalone={!run?.output} />
      break;
    case 'qri':
      editor = <></>
      break;
    default:
      editor = <p>unknown editor for '{syntax}' workflow step</p>
  }

  return (
    <div id={`${step.name}-cell`} className='w-full mb-4'>
        <ScrollAnchor id={step.name} />
        <header>
          <div className=''>
            {run && <p className='float-right'>{run.duration}</p>}
            <h3 className='text-sm text-qrinavy font-semibold cursor-pointer mb-0.5' onClick={() => {
              onChangeCollapse(collapseState === 'all' ? 'collapsed' : 'all')
            }}>{name}</h3>
            <div className='text-xs mb-2.5 text-gray-400'>{description}</div>
          </div>
        </header>
        {(collapseState === 'all' || collapseState === 'only-editor') && editor}
        {(collapseState === 'all' || collapseState === 'only-output') && run?.output && <Output data={run?.output} status={run?.status} />}
      </div>
  )
}

export default WorkflowCell
