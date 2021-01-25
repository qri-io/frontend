import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faBolt, faProjectDiagram, faCloudUploadAlt, faEnvelope, faCheck, faTimes, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'

import WorkflowCell from './WorkflowCell';
import Triggers from './Triggers';
import OnComplete from './OnComplete';
import { NewRunStep, RunState, RunStep } from '../../qrimatic/run';
import { TransformStep } from '../../qrimatic/workflow';
import { selectLatestRun, selectWorkflow } from './state/workflowState';
import { changeTransformStep, changeDatasetName, runWorkflow, setWorkflow, tempSetWorkflowEvents, setWorkflowRef } from './state/workflowActions';
import { eventLogSuccess, eventLogWithError, NewEventLogLines } from '../../qrimatic/eventLog'
import { selectTemplate } from '../template/templates';
import RunBar from './RunBar';
import { QriRef } from '../../qri/ref';
import { showModal } from '../app/state/appActions';
import { AppModalType } from '../app/state/appState';

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

  useEffect(() => {
    dispatch(setWorkflowRef(qriRef))
  }, [dispatch, qriRef])

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
      <div className='outline h-full w-96 p-4 text-left border-r'>
        <div className='font-semibold text-gray-600 mb-2'>Triggers</div>
          <div className='text-xs inline-block py-1 px-2 rounded border'>
            <FontAwesomeIcon icon={faClock}/>
          </div>
          <div className='text-xs inline-block py-1 px-2 rounded border'>
            <FontAwesomeIcon icon={faProjectDiagram}/>
          </div>
          <div className='text-xs inline-block py-1 px-2 rounded border'>
            <FontAwesomeIcon icon={faBolt}/>
          </div>
        <div  className='font-semibold text-gray-600 mb-2'>
          Script <div className='float-right text-blue-500'><FontAwesomeIcon icon={faSpinner} spin /></div>
        </div>
        <div className='mb-2'>
          <div className='text-sm ml-2'><span className='font-black text-gray-400'>1</span> &nbsp; Setup <div className='float-right text-green-500'><FontAwesomeIcon icon={faCheck} /></div></div>
          <div className='text-sm ml-2'><span className='font-black text-gray-400'>2</span> &nbsp; Download <div className='float-right text-green-500'><FontAwesomeIcon icon={faCheck} /></div></div>
          <div className='text-sm ml-2'><span className='font-black text-gray-400'>3</span> &nbsp; Transform <div className='float-right text-red-500'><FontAwesomeIcon icon={faTimes} /></div></div>
          <div className='text-sm ml-2'><span className='font-black text-gray-400'>4</span> &nbsp; Save <div className='float-right text-yellow-500'><FontAwesomeIcon icon={faExclamationCircle} /></div></div>
        </div>
        <div className='font-semibold text-gray-600 mb-2'>On Completion</div>
        <div className='text-xs inline-block py-1 px-2 rounded border'>
          <FontAwesomeIcon icon={faCloudUploadAlt}/>
        </div>
        <div className='text-xs inline-block py-1 px-2 rounded border'>
          <FontAwesomeIcon icon={faBolt}/>
        </div>
        <div className='text-xs inline-block py-1 px-2 rounded border'>
          <FontAwesomeIcon icon={faEnvelope}/>
        </div>
        <button
          className='mt-4 py-1 px-4 w-full font-semibold shadow-md text-white bg-gray-600 hover:bg-gray-300 rounded'
        >
          Deploy Workflow
        </button>
      </div>
      <div className='overflow-y-auto p-4 text-left h-full'>
        <Triggers />
        <section className='p-4'>
          <h2 className='text-2xl font-semibold text-gray-600 mb-1'>Script</h2>
          <div className='text-xs mb-3'>Use code to download source data, transform it, and commit the next version of this dataset</div>
          <RunBar
            qriRef={qriRef}
            status={latestRun ? latestRun.status : RunState.waiting }
            onRun={() => {
              setCollapseStates({})
              dispatch(runWorkflow(workflow))
            }}
            onRunCancel={() => { alert('cannot cancel runs yet') }}
            onDeploy={() => { dispatch(showModal(AppModalType.deployWorkflow)) }}
            onDeployCancel={() => { alert('cannot cancel deploys yet') }}
            onRename={(name: string) => { dispatch(changeDatasetName(name)) }}
          />
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
                    dispatch(changeTransformStep(i,v))
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
      <div className='outline h-full w-96 p-4 text-left border-r'>
        Common Tasks
        <div className='rounded h-24 border mb-4'>
        </div>
        <div className='rounded h-24 border mb-4'>
        </div>
        <div className='rounded h-24 border mb-4'>
        </div>
        <div className='rounded h-24 border mb-4'>
        </div>
        <div className='rounded h-24 border mb-4'>
        </div>

      </div>
    </div>
  )
}

export default WorkflowEditor;
