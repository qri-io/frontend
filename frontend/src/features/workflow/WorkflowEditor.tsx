import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import WorkflowCell from './WorkflowCell';
import { NewRunStep, RunState, RunStep } from '../../qrimatic/run';
import { WorkflowStep } from '../../qrimatic/workflow';
import { selectLatestRun, selectWorkflow } from './state/workflowState';
import { changeWorkflowStep, runWorkflow, setWorkflow, tempSetWorkflowEvents } from './state/workflowActions';
import { eventLogSuccess, eventLogWithError, NewEventLogLines } from '../../qrimatic/eventLog'
import { showModal } from '../app/state/appActions';
import { AppModalType } from '../app/state/appState';
import { selectTemplate } from '../template/templates';

interface WorkflowEditorLocationState {
  template: string
}

const triggerItems = [
  {
    name: 'Run on a Schedule',
    description: 'Run the workflow every day at 11:30am'
  },
  {
    name: 'Run when another dataset is updated',
    description: 'The workflow will run whenever b5/world_bank_population is updated'
  },
  {
    name: 'Run with a webhook',
    description: 'The workflow will run when this webhook is called: https://qrimatic.qri.io/my-dataset'
  },
]

const onCompleteItems = [
  {
    name: 'Push to Qri Cloud',
    description: 'If the workflow results in a new version of the dataset, it will be published on qri.cloud'
  },
  {
    name: 'Call Webhook',
    description: 'If the workflow results in a new version of the dataset, call http://mywebook.com/somewebhook'
  },
  {
    name: 'Email Workflow Report',
    description: 'Whenever the workflow finishes, email chris@qri.io with a report'
  }
]

const GenericItem: React.FC<any> = ({ name, description }) => (
  <div className='my-2 px-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/3'>
    <div className='bg-white px-4 py-2 rounded mt-1 border-b border-gray-300 cursor-pointer hover:bg-gray-100'>
      <div className='font-semibold pb-1'>{name}</div>
      <div className='text-xs'>{description}</div>
    </div>
  </div>
)

const WorkflowEditor: React.FC<any> = () => {
  const dispatch = useDispatch()
  const location = useLocation<WorkflowEditorLocationState>()
  
  useEffect(() => {
    if (location.state && location.state.template) {
      dispatch(setWorkflow(selectTemplate(location.state.template)))
    }
  }, [dispatch, location.state])

  const [collapseStates, setCollapseStates] = useState({} as Record<string, "all" | "collapsed" | "only-editor" | "only-output">)
  const workflow = useSelector(selectWorkflow)
  const latestRun = useSelector(selectLatestRun)

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
          return 'all'
        default:
          return 'all'
      }
    }
    return 'all'
  }

  return (
    <div className='container mx-auto pt-5 pb-10 text-left'>
      <section className='rounded bg-gray-200 p-4 mb-6'>
        <h2 className='text-2xl font-semibold text-gray-600 mb-3'>Triggers</h2>
        <div className='text-xs'>Customize your workflow to execute on a schedule, or based on other events</div>
        <div className='flex flex-wrap -mx-2 overflow-hidden'>
          {triggerItems.map((d) => (<GenericItem {...d} />))}
        </div>
      </section>
      <section className='rounded bg-gray-200 p-4 mb-6'>
        <h2 className='text-2xl font-semibold text-gray-600 mb-3'>Script</h2>
        <div className='text-xs'>Use code to download source data, transform it, and commit the next version of this dataset</div>
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
      <div className='rounded bg-gray-200 p-4 mb-6'>
        <h2 className='text-2xl font-semibold text-gray-600 mb-3'>On Complete</h2>
        <div className='text-xs'>Configure actions that will happen when the workflow finishes</div>
        <div className='flex flex-wrap -mx-2 overflow-hidden'>
          {onCompleteItems.map((d) => (<GenericItem {...d} />))}
        </div>
      </div>
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
