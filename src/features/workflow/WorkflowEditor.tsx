import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Hotkeys from 'react-hot-keys'

import WorkflowCell from './WorkflowCell'
import WorkflowTriggersEditor from '../trigger/WorkflowTriggersEditor'
import OnComplete from './OnComplete'
import { NewRunStep, Run, RunStep } from '../../qri/run'
import { changeWorkflowTransformStep, applyWorkflowTransform } from './state/workflowActions'
import { RunMode } from './state/workflowState'
import { Workflow } from '../../qrimatic/workflow'
import ScrollAnchor from '../scroller/ScrollAnchor'
import ContentBox from '../../chrome/ContentBox'
import DeployButton from '../deploy/DeployButton'
import WorkflowDatasetPreview from './WorkflowDatasetPreview'


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

  const onKeyDown = (keyName: string) => {
    if (keyName === 'cmd+enter') {
      dispatch(applyWorkflowTransform(workflow))
    }
  }

  return (
    <Hotkeys
      keyName="cmd+enter,ctrl+enter"
      onKeyDown={onKeyDown}
    >
      <div className='flex-grow min-w-0'>
        <div className=''>
          <WorkflowTriggersEditor triggers={workflow.triggers} />
          <ContentBox className='mb-7' paddingClassName='px-5 py-4'>
            <ScrollAnchor id='script' />
            <section className='bg-white mb-4 border-b-2 border-qrigray-100 mb-7'>
              <div className='bg-white top-0 z-10 flex mb-3'>
                <div className='flex-grow'>
                  <h2 className='text-2xl font-medium text-qrinavy mb-1'>Script</h2>
                  <div className='text-sm text-qrigray-400 mb-3'>Use code to download source data, transform it, and commit the next version of this dataset</div>
                </div>
              </div>
              {workflow.steps && workflow.steps.map((step, i) => {
                let r
                if (run) {
                  r = (run?.steps && run?.steps.length >= i) ? run.steps[i] : NewRunStep({ status: "waiting" })
                }
                return (
                  <WorkflowCell
                    key={step.category}
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
                  />
                )
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
            </section>
            <h3 className='text-sm text-qrinavy font-semibold cursor-pointer mb-0.5'>
              New Version Preview
            </h3>

            <div className='text-xs mb-2.5 text-gray-400'>Your script will create a new version of this dataset.</div>

            <ScrollAnchor id='new-version-preview' />
            <WorkflowDatasetPreview dataset={run?.dsPreview}/>
          </ContentBox>
          <OnComplete />
          <DeployButton workflow={workflow} />
        </div>
      </div>
    </Hotkeys>
  )
}

export default WorkflowEditor
