import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import WorkflowOutline from './WorkflowOutline';
import WorkflowCell from './WorkflowCell';
import Triggers from './Triggers';
import OnComplete from './OnComplete';
import { NewRunStep, RunState, RunStep } from '../../qrimatic/run';
import { TransformStep } from '../../qri/dataset';
import { selectLatestRun, selectWorkflow } from './state/workflowState';
import { changeWorkflowTransformStep, runWorkflow, setWorkflow, setWorkflowRef } from './state/workflowActions';
import { selectTemplate } from '../template/templates';
import { QriRef } from '../../qri/ref';
import { AppModalType } from '../app/state/appState';
import { showModal } from '../app/state/appActions';
import RunBar from './RunBar';

interface WorkflowEditorLocationState {
  template: string
}

export interface WorkflowEditorProps {
  qriRef: QriRef
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  const location = useLocation<WorkflowEditorLocationState>()
  const workflow = useSelector(selectWorkflow)
  const latestRun = useSelector(selectLatestRun)

  useEffect(() => {
    if (location.state && location.state.template) {
      dispatch(setWorkflow(selectTemplate(location.state.template)))
    }
  }, [dispatch, location.state])

  useEffect(() => {
    dispatch(setWorkflowRef(qriRef))
  }, [dispatch, qriRef])

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
    <div className='flex h-full'>
      <div className='outline h-full w-56 border-r flex-none'>
        <WorkflowOutline onDeploy={() => { dispatch(showModal(AppModalType.deployWorkflow)) }} />
      </div>
      <div className='overflow-y-auto p-4 text-left h-full flex-grow'>
        <RunBar
          status={latestRun ? latestRun.status : RunState.waiting }
          onRun={() => {
            setCollapseStates({})
            dispatch(runWorkflow(workflow))
          }}
          onRunCancel={() => { alert('cannot cancel runs yet') }}
          onDeploy={() => { dispatch(showModal(AppModalType.deployWorkflow)) }}
          onDeployCancel={() => { alert('cannot cancel deploys yet') }}
        />
        <Triggers />
        <section className='p-4'>
          <h2 className='text-2xl font-semibold text-gray-600 mb-1'>Script</h2>
          <div className='text-xs mb-3'>Use code to download source data, transform it, and commit the next version of this dataset</div>
          <div>
            {workflow.steps && workflow.steps.map((step, i) => {
              let run
              if (latestRun) {
                run = (latestRun?.steps && latestRun?.steps.length >= i) ? latestRun.steps[i] : NewRunStep({ status: RunState.waiting })
              }
              return (<WorkflowCell
                key={i}
                index={i}
                step={step}
                run={run}
                collapseState={collapseState(step, run)}
                onChangeCollapse={(v) => {
                  const update = Object.assign({}, collapseStates as any)
                  update[step.name] = v
                  console.log(update)
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
    </div>
  )
}

export default WorkflowEditor;
