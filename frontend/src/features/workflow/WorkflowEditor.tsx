import React, { useEffect, useState } from 'react'

import WorkflowCell from './WorkflowCell';
import { NewRunFromEventLog, NewRunStep, Run, RunState, RunStep } from '../../qrimatic/run';
import { NewWorkflow, Workflow, WorkflowStep } from '../../qrimatic/workflow';
import { EventLogLineType, NewLogEvents } from '../../qrimatic/eventLog';

const initialState: WorkflowEditorProps = {
  workflow: NewWorkflow({
    datasetID: 'fake_id',
    triggers: [
      { type: 'cron', value: 'R/PT1H' }
    ],
    steps: [
      { type: 'starlark', name: 'setup', value: `load("http", "http")\nds_presidents = load_ds("rico/famous_presidents")` },
      { type: 'starlark', name: 'download', value: `def download(ctx):\n\treturn http.get("https://fed.gov/presidents").json` },
      { type: 'starlark', name: 'transform', value: 'def transform(ds,ctx):\n\tds.set_body(ctx.download)' },
      { type: 'save', name: 'save', value: '' }
    ],
    onCompletion: [
      { type: 'push', value: 'https://registry.qri.cloud' },
    ]
  })
}

const logLines = NewLogEvents([
  { "t": EventLogLineType.LTTransformStart,        "ts": "2021-01-01T00:00:00Z", "sid": "aaaa", "p": {"id": "aaaa" }},
  { "t": EventLogLineType.LTTransformStepStart,   "ts": "2021-01-01T00:00:01Z", "sid": "aaaa", "p": {"name": "setup" }},
  { "t": EventLogLineType.LTVersionPulled,           "ts": "2021-01-01T00:00:10Z", "sid": "aaaa", "p": {"refstring": "rico/presidents@QmFoo", "remote": "https://registy.qri.cloud" }},
  { "t": EventLogLineType.LTTransformStepStop,     "ts": "2021-01-01T00:00:01Z", "sid": "aaaa", "p": {"name": "setup", "status": "succeeded" }},
  { "t": EventLogLineType.LTTransformStepStart,   "ts": "2021-01-01T00:00:01Z", "sid": "aaaa", "p": {"name": "download" }},
  { "t": EventLogLineType.LTPrint,                   "ts": "2021-01-01T00:00:20Z", "sid": "aaaa", "p": {"msg": "oh hai there" }},
  { "t": EventLogLineType.LTHttpRequestStop, "ts": "2021-01-01T00:00:20Z", "sid": "aaaa", "p": {"size": 230409, "method": "GET", "url": "https://registy.qri.cloud" }},
  { "t": EventLogLineType.LTTransformStepStop,    "ts": "2021-01-01T00:00:21Z", "sid": "aaaa", "p": {"name": "download", "status": "succeeded" }},
  { "t": EventLogLineType.LTTransformStepStart,   "ts": "2021-01-01T00:00:21Z", "sid": "aaaa", "p": {"name": "transform" }},
  { "t": EventLogLineType.LTTransformStepStop,    "ts": "2021-01-01T00:00:22Z", "sid": "aaaa", "p": {"name": "transform", "status": "failed", "error": "oh shit. it broke." }},
  { "t": EventLogLineType.LTTransformStepSkip,   "ts": "2021-01-01T00:00:22Z", "sid": "aaaa", "p": {"name": "save" }},
  { "t": EventLogLineType.LTTransformStop,        "ts": "2021-01-01T00:01:00Z", "sid": "aaaa", "p": {"status": "failed" }}
])

export interface WorkflowEditorProps {
  workflow: Workflow
  run?: Run
}

const WorkflowEditor: React.FC<any> = () => {
  const [state, setState] = useState(initialState)
  const [running, setRunning] = useState(false)
  const [collapseStates, setCollapseStates] = useState({} as Record<string, "all" | "collapsed" | "only-editor" | "only-output">)

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

  useEffect(() => {
    if (running) {
      let i = 0
      const timer = setInterval(() => {
        i++
        setState({
          workflow: state.workflow,
          run: NewRunFromEventLog("aaaa", logLines.slice(0,i)),
        })
        if (i === logLines.length) {
          console.log('done running')
          clearInterval(timer)
          setRunning(false)
          i = 0
        }
      }, 1000)
    }
  }, [running, state.workflow])

  return (
    <div className='container mx-auto py-10 text-left'>
      <hr className='border-solid border-gray-200 mx-4' />
      <section className='py-5'>
        <h2 className='text-2xl font-semibold text-gray-600'>Triggers</h2>
        <div className='py-5 grid grid-cols-5'>
          <div className='bg-gray-200 px-3 py-3 rounded-md'>
            <p>Every night at 11:30pm</p>
          </div>
        </div>
      </section>
      <section className='py-5'>
        <h2 className='text-2xl font-semibold text-gray-600'>Script</h2>
        <div>
          {state.workflow.steps && state.workflow.steps.map((step, i) => {
            let run
            if (state.run) {
              run = (state.run.steps && state.run.steps.length >= i) ? state.run.steps[i] : NewRunStep({ status: RunState.waiting })
            }
            return (<WorkflowCell 
              key={i}
              step={step}
              run={run}
              collapseState={collapseState(step, run)}
              onChangeCollapse={(v) => {
                const update = Object.assign({}, collapseStates as any)
                update[step.name] = v
                console.log(update)
                setCollapseStates(update)
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
            setRunning(!running)
          }}
        >{running ? 'Cancel' : 'Run' }</button>
      </div>
    </div>
  )
}

export default WorkflowEditor;
