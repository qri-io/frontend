import React from 'react'
import { RunStep } from '../../qri/run'
import { TransformStep } from '../../qri/dataset'
import CodeEditor from './CodeEditor'
import Output from './output/Output'
import ScrollAnchor from '../scroller/ScrollAnchor'
import WorkflowHeading from "./WorkfolwHeading";
import WorkflowCellControls from "./WorkflowCellControls";

export interface WorkflowCellProps {
  index: number
  step: TransformStep
  run?: RunStep
  disabled: boolean;
  collapseState: 'collapsed' | 'only-editor' | 'only-output' | 'all'
  onChangeCollapse: (v: 'collapsed' | 'only-editor' | 'only-output' | 'all') => void
  onChangeScript: (index: number, script: string) => void
  onRun: () => void
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
}) => {
  const { syntax, name, script } = step

  let editor: React.ReactElement
  switch (syntax) {
    case 'starlark':
      editor = <CodeEditor script={script} onChange={(v) => { onChangeScript(index, v) }} onRun={onRun} disabled={disabled} standalone={!run?.output} />
      break;
    case 'qri':
      editor = <></>
      break;
    case 'heading': // TODO (boandriy): implement when markdown step will be introduced on BE
      editor = <WorkflowHeading title={script} onChange={(v) => { onChangeScript(index, v) }}/>
      break;
    default:
      editor = <p>unknown editor for '{syntax}' workflow step</p>
  }

  return (
    <div id={`${name}-cell`} className='w-full group flex'>
      <div className={'flex-grow'}>
        <ScrollAnchor id={name} />
        {(collapseState === 'all' || collapseState === 'only-editor') && editor}
        {(collapseState === 'all' || collapseState === 'only-output') && run?.output && <Output data={run?.output} status={run?.status} />}
        <div onClick={() => onRowAdd(index, 'starlark')}
             className={'mt-2 mb-2 cursor-pointer opacity-0 hover:opacity-100 transition-opacity flex items-center'}>
          <div className={'h-px bg-gray-300 flex-grow mr-2'} />
          <button className={'text-xs border-none flex-shrink-0 bg-white rounded py-1 pr-2 pl-1 font-semibold '}>+ Code</button>
        </div>
      </div>

      <WorkflowCellControls index={index} />
      </div>
  )
}

export default WorkflowCell
