import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Hotkeys from 'react-hot-keys'

import WorkflowCell from './WorkflowCell'
import { NewRunStep, RunStep } from '../../qri/run'
import { Dataset, NewDataset, TransformStep } from '../../qri/dataset'
import { Workflow } from '../../qrimatic/workflow'
import ScrollAnchor from '../scroller/ScrollAnchor'
import WorkflowDatasetPreview from './WorkflowDatasetPreview'
import { QriRef } from '../../qri/ref'
import { removeEvent } from "../events/state/eventsActions"
import { selectDeployRunId } from "../deploy/state/deployState"
import { deployResetRunId } from "../deploy/state/deployActions"
import { selectSessionUserCanEditDataset } from "../dataset/state/datasetState"
import {
  changeWorkflowTransformStep,
  applyWorkflowTransform
} from './state/workflowActions'
import {
  selectWorkflowDataset,
  selectLatestDeployOrDryRunId,
  selectLatestDryRunId,
  selectLatestRunId
} from './state/workflowState'
import { selectRun } from "../events/state/eventsState"
import WorkflowSidebar from './WorkflowSidebar'

export interface WorkflowEditorProps {
  qriRef: QriRef
  workflow: Workflow
}

// combines the `script` text for multiple steps into one step
// we moved to a single step in the UI but need to be compatible with older multistep transforms
const mergeSteps = (steps: TransformStep[] | undefined) => {
  if (!steps || steps.length < 2) {
    return steps
  }

  const merged: TransformStep[] = steps.reduce((acc: TransformStep[], curr, i) => {
    if (i === 0) {
      acc[0] = { ...curr }
    } else {
      acc[0].script = `${acc[0].script}\n\n${curr.script}`
    }
    return acc
  }, [])

  return merged
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  qriRef,
  workflow
}) => {
  const dispatch = useDispatch()

  const latestDryRunId = useSelector(selectLatestDryRunId)
  const latestRunId = useSelector(selectLatestRunId)
  const latestDeployRunId = useSelector(selectDeployRunId)
  const canEdit = useSelector(selectSessionUserCanEditDataset)

  const dataset = useSelector(selectWorkflowDataset)
  const latestDryRunDeployID = useSelector(selectLatestDeployOrDryRunId)
  const run = useSelector(selectRun(latestDryRunDeployID))

  const [activeCell, setActiveCell] = useState<number>(-1)

  const isNew = !qriRef.username && !qriRef.name

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

  // dry run, trigger by keystroke
  const runScript = () => {
    // remove run events
    if (latestDryRunId) {
      dispatch(removeEvent(latestDryRunId))
    }
    if (latestRunId) {
      dispatch(removeEvent(latestRunId))
    }
    if (latestDeployRunId) {
      dispatch(removeEvent(latestDeployRunId))
    }
    dispatch(deployResetRunId())
    dispatch(applyWorkflowTransform(workflowRef.current, workflowDatasetRef.current))
  }

  const onKeyDown = (keyName: string) => {
    if (keyName === 'cmd+enter') {
      runScript()
    }
  }

  const displaySteps = mergeSteps(dataset.transform?.steps)

  // appends username, name, and meta.title to a dry run's preview, useful for
  // display of downstream components that expect these as part of a Dataset (e.g. fullscreen body)
  const appendRefAndMeta = (dsPreview: Dataset | undefined) => {
    if (dsPreview) {
      return NewDataset({
        ...dsPreview,
        username: qriRef.username,
        name: qriRef.name,
        meta: dsPreview.meta || { title: 'Workflow Result' }
      })
    }

    return dsPreview
  }

  // to deploy, the workflow must have a RunStatus of succeeded and isDirty = true
  return (
    <>
      <div id='workflow' className='w-full flex min-w-0'>
        <Hotkeys
          keyName="cmd+enter,ctrl+enter"
          onKeyDown={onKeyDown}
        >
          <div className='flex-grow flex-shrink min-w-0 z-10'>
            <div className=''>
              <div className='' >
                <ScrollAnchor id='script' />
                <section className='mb-4 border-b-2 border-qrigray-100 mb-7'>
                  <div className='top-0 z-10 flex mb-3'>
                    <div className='flex-grow'>
                      <h2 className='text-xl font-bold text-black mb-1'>Script</h2>
                      <div className='text-base text-qrigray-400 mb-3'>Use code to download source data, transform it, and commit the next version of this dataset</div>
                    </div>
                  </div>
                  {displaySteps && displaySteps.map((step, i) => {
                    // eslint-disable-next-line no-undef-init
                    let r: RunStep | undefined = undefined
                    if (run) {
                      r = (run?.steps && run?.steps.length >= i) ? run.steps[i] : NewRunStep({ status: "waiting" })
                      if (r) { r.id = run.id }
                    }
                    return (
                      <WorkflowCell
                        active={activeCell === i}
                        disabled={run?.status === 'running' || (!canEdit && !isNew)}
                        key={step.category}
                        index={i}
                        step={step}
                        run={r}
                        onRun={runScript}
                        onChangeScript={(i: number, script: string) => {
                          if (dataset?.transform?.steps) {
                            dispatch(changeWorkflowTransformStep(i, script))
                          }
                        }}
                        onClick={() => { setActiveCell(i) }}
                      />
                    )
                  })}
                </section>
                <h3 className='text-xl text-black font-semibold cursor-pointer mb-0.5'>
                  Next Version Preview
                </h3>

                <div className='text-base mb-2.5 text-qrigray-400'>Dry Run this script and preview the next version of the dataset here</div>

                <ScrollAnchor id='result' />
                <div className='w-full'>
                  <div className='flex' >
                    <div className='flex-grow min-w-0'>
                      <WorkflowDatasetPreview dataset={appendRefAndMeta(run?.dsPreview)}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Hotkeys>
        <div className='flex-shrink-0' style={{ width: 295 }}>
          <WorkflowSidebar workflow={workflow} />
        </div>
      </div>
    </>
  )
}

export default WorkflowEditor
