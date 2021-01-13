import React, { useState } from 'react'

import WorkflowCell from './WorkflowCell';
import { NewRunStep, RunState, RunStep } from '../../qrimatic/run';
import { WorkflowStep } from '../../qrimatic/workflow';
import { useDispatch, useSelector } from 'react-redux';
import { selectLatestRun, selectWorkflow } from './state/workflowState';
import { changeWorkflowStep, runWorkflow, tempSetWorkflowEvents } from './state/workflowActions';
import { eventLogSuccess, eventLogWithError, NewEventLogLines } from '../../qrimatic/eventLog'
import { showModal } from '../app/state/appActions';
import { AppModalType } from '../app/state/appState';

const WorkflowEditor: React.FC<any> = () => {
  const [collapseStates, setCollapseStates] = useState({} as Record<string, "all" | "collapsed" | "only-editor" | "only-output">)
  const workflow = useSelector(selectWorkflow)
  const latestRun = useSelector(selectLatestRun)
  const dispatch = useDispatch()
  const running = latestRun ? (latestRun.status === 'running') : false

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
          return 'collapsed'
        default:
          return 'collapsed'
      }
    }
    return 'all'
  }

  return (
    <div className='container mx-auto pt-5 pb-10 text-left'>
      <section className='py-5'>
        <h2 className='text-2xl font-semibold text-gray-600'>Triggers</h2>
        <div className='py-5 grid grid-cols-5'>
          <div className='bg-gray-200 px-3 py-3 rounded-md' onClick={() => { dispatch(showModal(AppModalType.schedulePicker)) }}>
            <p>Every night at 11:30pm</p>
          </div>
        </div>
      </section>
      <section className='py-5'>
        <h2 className='text-2xl font-semibold text-gray-600'>Script</h2>
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
      <section className='py-5'>
        <h2 className='text-2xl font-semibold text-gray-600'>On Complete</h2>
        <p>No Hooks</p>
      </section>
      <div>
        <button
          className='py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-300'
          onClick={() => { 
            if (!running) {
              setCollapseStates({})
            }
            if (!running) {
              dispatch(runWorkflow(workflow))
            } else {
              alert('cancelling a workflow isn\'t wired up yet')
            }
          }}
        >{running ? 'Cancel' : 'Run' }</button>
        <button
          className='py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-300'
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
          className='py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-300'
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
