import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import WorkflowCell from './WorkflowCell';
import Triggers from './Triggers';
import OnComplete from './OnComplete';
import { NewRunStep, RunState, RunStep } from '../../qrimatic/run';
import { WorkflowStep } from '../../qrimatic/workflow';
import { selectLatestRun, selectWorkflow } from './state/workflowState';
import { changeWorkflowStep, runWorkflow, setWorkflow, tempSetWorkflowEvents } from './state/workflowActions';
import { eventLogSuccess, eventLogWithError, NewEventLogLines } from '../../qrimatic/eventLog'
import { selectTemplate } from '../template/templates';
import RunBar from './RunBar';
import { QriRef } from '../../qri/ref';

interface WorkflowEditorLocationState {
  template: string
}

export interface WorkflowEditorProps {
  qriRef: QriRef
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ qriRef }) => {
  const [collapseStates, setCollapseStates] = useState({} as Record<string, "all" | "collapsed" | "only-editor" | "only-output">)
  const workflow = useSelector(selectWorkflow)
  const latestRun = useSelector(selectLatestRun)
  const running = latestRun ? (latestRun.status === 'running') : false
  const dispatch = useDispatch()
  const location = useLocation<WorkflowEditorLocationState>()

  useEffect(() => {
    if (location.state && location.state.template) {
      dispatch(setWorkflow(selectTemplate(location.state.template)))
    }
  }, [dispatch, location.state])

  const collapseState = (step: WorkflowStep, run?: RunStep): "all" | "collapsed" | "only-editor" | "only-output" => {
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
    <div className='container mx-auto pb-10 text-left'>
      <RunBar
        qriRef={qriRef}
        status={latestRun ? latestRun.status : RunState.waiting }
        onRun={() => {
          setCollapseStates({})
          dispatch(runWorkflow(workflow))
        }}
        onRunCancel={() => { alert('cannot cancel runs just yet') }}
        onDeploy={() => { alert('deploy isn\'t wired up yet')}}
        onDeployCancel={() => { alert('cannot cancel deploys just yet') }}
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
                  dispatch(changeWorkflowStep(i,v))
                }
              }}
            />)
          })}
        </div>
      </section>
      <OnComplete />
      <div>
        <button
            className='py-1 px-4 mx-1 font-semibold shadow-md text-white bg-gray-600 hover:bg-gray-300'
            onClick={() => {
              if (!running) {
                setCollapseStates({})
              }
              if (!running) {
                dispatch(tempSetWorkflowEvents("aaaa", NewEventLogLines(eventLogWithError)))
              } else {
                alert('cancelling a workflow isn\'t wired up yet')
              }
            }}
          >{running ? 'Cancel' : 'Run with Errors' }</button>
          <button
            className='py-1 px-4 mx-1 font-semibold shadow-md text-white bg-gray-600 hover:bg-gray-300'
            onClick={() => {
              if (!running) {
                setCollapseStates({})
              }
              if (!running) {
                dispatch(tempSetWorkflowEvents("bbbb", NewEventLogLines(eventLogSuccess)))
              } else {
                alert('cancelling a workflow isn\'t wired up yet')
              }
            }}
          >{running ? 'Cancel' : 'Run with dataset' }</button>
        </div>
    </div>
  )
}

export default WorkflowEditor;
