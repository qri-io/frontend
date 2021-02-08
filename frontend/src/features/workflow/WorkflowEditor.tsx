import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import WorkflowCell from './WorkflowCell';
import WorkflowTriggersEditor from '../trigger/WorkflowTriggersEditor';
import OnComplete from './OnComplete';
import { NewRunStep, Run, RunState, RunStep } from '../../qrimatic/run';
import { TransformStep } from '../../qri/dataset';
import { changeWorkflowTransformStep } from './state/workflowActions';
import RunBar from './RunBar';
import { Workflow } from '../../qrimatic/workflow';
import Scroller from '../scroller/Scroller';
import ScrollAnchor from '../scroller/ScrollAnchor';
import { RunMode } from './state/workflowState';

export interface WorkflowEditorProps {
  runMode: RunMode
  workflow: Workflow
  run?: Run
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ runMode, run, workflow }) => {
  const dispatch = useDispatch()

  const [collapseStates, setCollapseStates] = useState({} as Record<string, "all" | "collapsed" | "only-editor" | "only-output">)
  const collapseState = (stepName: string, run?: RunStep): "all" | "collapsed" | "only-editor" | "only-output" => {
    if (collapseStates[stepName]) {
      return collapseStates[stepName]
    }

    if (run) {
      switch (run.status) {
        case 'running':
          return 'all'
        case 'failed':
          return 'all'
        case 'succeeded':
          return 'all'
        default:
          return 'all'
      }
    }
    return 'all'
  }

  return (
    <Scroller className='overflow-y-auto p-4 text-left h-full flex-grow'>
      <WorkflowTriggersEditor triggers={workflow.triggers} />
      <ScrollAnchor id='script' />
      <section className='bg-white shadow-sm mb-4'>
          <div className='bg-white sticky top-0 z-10 p-4 flex bg-opacity-90'>
            <div className='flex-grow'>
                <h2 className='text-2xl font-semibold text-gray-600 mb-1'>Script</h2>
              <div className='text-xs'>Use code to download source data, transform it, and commit the next version of this dataset</div>
            </div>
            <RunBar status={run ? run.status : RunState.waiting } onRun={() => {setCollapseStates({})}} />
          </div>
        <div className='px-4'>
          {workflow.steps && workflow.steps.map((step, i) => {
            let r
            if (run) {
              r = (run?.steps && run?.steps.length >= i) ? run.steps[i] : NewRunStep({ status: RunState.waiting })
            }
            return (<WorkflowCell
              key={i}
              index={i}
              step={step}
              run={r}
              collapseState={collapseState(step.name, r)}
              onChangeCollapse={(v) => {
                const update = Object.assign({}, collapseStates as any)
                update[step.name] = v
                setCollapseStates(update)
              }}
              onChangeScript={(i:number, script:string) => {
                if (workflow && workflow.steps) {
                  dispatch(changeWorkflowTransformStep(i, script))
                }
              }}
            />)
          })}
          {/* TODO(b5) - hack for now. In the future we should make a component that trances & selects save results */}
          {runMode === 'save' && <WorkflowCell 
            index={(workflow.steps?.length || 1)}
            step={{name: 'save', syntax: 'qri', category: 'save', script: ''}}
            collapseState={collapseState('save')}
            onChangeCollapse={(v) => {
              const update = Object.assign({}, collapseStates as any)
              update['save'] = v
              setCollapseStates(update)
            }}
            onChangeScript={() => {}}
            />}
        </div>
      </section>
      <OnComplete />
    </Scroller>
  )
}

export default WorkflowEditor
