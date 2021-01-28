import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import WorkflowCell from './WorkflowCell';
import WorkflowTriggersEditor from '../trigger/WorkflowTriggersEditor';
import OnComplete from './OnComplete';
import { NewRunStep, Run, RunState, RunStep } from '../../qrimatic/run';
import { TransformStep } from '../../qri/dataset';
import { changeWorkflowTransformStep, runWorkflow } from './state/workflowActions';
import { ModalType } from '../app/state/appState';
import { showModal } from '../app/state/appActions';
import RunBar from './RunBar';
import { Workflow } from '../../qrimatic/workflow';

export interface WorkflowEditorProps {
  workflow: Workflow
  run?: Run
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ run, workflow }) => {
  const dispatch = useDispatch()

  const [collapseStates, setCollapseStates] = useState({} as Record<string, "all" | "collapsed" | "only-editor" | "only-output">)
  const collapseState = (step: TransformStep, run?: RunStep): "all" | "collapsed" | "only-editor" | "only-output" => {
    if (collapseStates[step.name]) {
      return collapseStates[step.name]
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
    <div className='overflow-y-auto p-4 text-left h-full flex-grow'>
      <WorkflowTriggersEditor triggers={workflow.triggers} />
      <section className='p-4 bg-white shadow-sm mb-4'>
        <h2 className='text-2xl font-semibold text-gray-600 mb-1'>Script</h2>
        <div className='text-xs mb-3'>Use code to download source data, transform it, and commit the next version of this dataset</div>
        <RunBar
          status={run ? run.status : RunState.waiting }
          onRun={() => {
            setCollapseStates({})
            dispatch(runWorkflow(workflow))
          }}
          onRunCancel={() => { alert('cannot cancel runs yet') }}
          onDeploy={() => { dispatch(showModal(ModalType.deployWorkflow)) }}
          onDeployCancel={() => { alert('cannot cancel deploys yet') }}
        />
        <div>
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
              collapseState={collapseState(step, r)}
              onChangeCollapse={(v) => {
                const update = Object.assign({}, collapseStates as any)
                update[step.name] = v
                setCollapseStates(update)
              }}
              onChangeValue={(i:number, v:string) => {
                if (workflow && workflow.steps) {
                  dispatch(changeWorkflowTransformStep(i,v))
                }
              }}
            />)
          })}
        </div>
      </section>
      <OnComplete />
    </div>
  )
}

export default WorkflowEditor
