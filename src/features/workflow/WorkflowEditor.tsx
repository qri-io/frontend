import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Hotkeys from 'react-hot-keys'


import {
  changeWorkflowTransformStep,
  applyWorkflowTransform,
  addWorkflowTransformStep,
} from './state/workflowActions'
import WorkflowCell from './WorkflowCell'
import WorkflowTriggersEditor from '../trigger/WorkflowTriggersEditor'
import Hooks from './Hooks'
import { NewRunStep, Run, RunStep } from '../../qri/run'
import { Dataset } from '../../qri/dataset'
import { RunMode } from './state/workflowState'
import { Workflow } from '../../qrimatic/workflow'
import ScrollAnchor from '../scroller/ScrollAnchor'
import DeployButton from '../deploy/DeployButton'
import WorkflowDatasetPreview from './WorkflowDatasetPreview'
import { QriRef } from '../../qri/ref'

export interface WorkflowEditorProps {
  qriRef: QriRef
  runMode: RunMode
  workflow: Workflow
  dataset: Dataset
  isDirty: boolean
  run?: Run
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  qriRef,
  runMode,
  workflow,
  dataset,
  isDirty,
  run
}) => {
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

  // necessary so that runScript has the latest workflow when it is executed
  // without it, runScript was firing the initialState of `workflow`
  const workflowRef = useRef(workflow)
  const workflowDatasetRef = useRef(dataset)
  useEffect(() => {
    workflowRef.current = workflow
  }, [workflow])

  useEffect(() => {
    workflowDatasetRef.current = dataset
  }, [dataset])

  const runScript = () => {
    dispatch(applyWorkflowTransform(workflowRef.current, workflowDatasetRef.current))
  }

  const onKeyDown = (keyName: string) => {
    if (keyName === 'cmd+enter') {
      runScript()
    }
  }

  // appends username, name, and meta.title to a dry run's preview, useful for
  // display of downstream components that expect these as part of a Dataset (e.g. fullscreen body)
  const appendRefAndMeta = (dsPreview: Dataset) => {
    if (dsPreview) {
      return {
        peername: qriRef.username,
        name: qriRef.name,
        meta: dsPreview.meta || { title: 'Workflow Result' },
        ...dsPreview
      }
    }

    return dsPreview
  }

  const isNew = qriRef.username === '' && qriRef.name === ''

  // to deploy, the workflow must have a RunStatus of succeeded and isDirty = true

  return (
    <Hotkeys
      keyName="cmd+enter,ctrl+enter"
      onKeyDown={onKeyDown}
    >
      <div className='flex-grow min-w-0 z-10'>
        <div className=''>
          <WorkflowTriggersEditor triggers={workflow.triggers} />
          <div className='mb-7 ' >
            <ScrollAnchor id='script' />
            <section className='mb-4 border-b-2 border-qrigray-100 mb-7'>
              <div className='top-0 z-10 flex mb-3'>
                <div className='flex-grow'>
                  <h2 className='text-xl font-bold text-black mb-1'>Script</h2>
                  <div className='text-sm text-qrigray-400 mb-3'>Use code to download source data, transform it, and commit the next version of this dataset</div>
                </div>
              </div>
              {dataset?.transform?.steps && dataset.transform.steps.map((step, i) => {
                let r
                if (run) {
                  r = (run?.steps && run?.steps.length >= i) ? run.steps[i] : NewRunStep({ status: "waiting" })
                }
                return (
                  <WorkflowCell
                    disabled={run?.status === 'running'}
                    key={step.category}
                    index={i}
                    step={step}
                    run={r}
                    onRun={runScript}
                    collapseState={collapseState(step.name, r)}
                    onChangeCollapse={(v) => {
                      const update = Object.assign({}, collapseStates as any)
                      update[step.name] = v
                      setCollapseStates(update)
                    }}
                    onRowAdd={(i:number,syntax: string) => dispatch(addWorkflowTransformStep(i, syntax))}
                    onChangeScript={(i:number, script:string) => {
                      if (dataset?.transform?.steps) {
                        dispatch(changeWorkflowTransformStep(i, script))
                      }
                    }}
                  />
                )
              })}
              {/* TODO(b5) - hack for now. In the future we should make a component that trances & selects save results */}
              {runMode === 'save' && <WorkflowCell
                disabled={false}
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
            </section>
            <h3 className='text-sm text-black font-semibold cursor-pointer mb-0.5'>
              Next Version Preview
            </h3>

            <div className='text-xs mb-2.5 text-gray-400'>Dry Run this transform and preview the next version of the dataset here</div>

            <ScrollAnchor id='result' />
            <div className='flex'>
              <div className='flex-grow min-w-0'>
                <WorkflowDatasetPreview dataset={appendRefAndMeta(run?.dsPreview)}/>
              </div>
              <div className='flex-shrink-0 w-48 ml-8'>
                {/* TODO (chriswhong): this is a sidebar placeholder that matches the width of the contextual menu which appears to the right of code cells */}
              </div>
            </div>
          </div>
          <Hooks />
          <div className='mt-6'>
            <ScrollAnchor id='deploy-button' />
            <div className='flex'>
              <div className='flex-grow min-w-0'>
                <DeployButton isNew={isNew} disabled={!isDirty} />
              </div>
              <div className='flex-shrink-0 w-48 ml-8'>
                {/* TODO (chriswhong): this is a sidebar placeholder that matches the width of the contextual menu which appears to the right of code cells */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Hotkeys>
  )
}

export default WorkflowEditor
