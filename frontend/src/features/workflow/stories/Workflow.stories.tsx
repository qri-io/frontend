import React from 'react';
import { Provider } from 'react-redux';
import { Story, Meta } from '@storybook/react';

import Workflow from "../Workflow";
import { configureStore, history } from '../../../store/store';
import { ConnectedRouter } from 'connected-react-router';

export default {
  title: 'Workflow/Workflow',
  component: Workflow,
  argTypes: {},
} as Meta;

const Template: Story<any> = (args) => (
  <Provider store={configureStore()}>
    <ConnectedRouter history={history}>
      <Workflow {...args} />
    </ConnectedRouter>
  </Provider>
);

export const Basic = Template.bind({})
Basic.args = {
  label: 'Basic',
}

// const initialState: WorkflowProps = {
//   workflow: NewWorkflow({
//     datasetID: 'fake_id',
//     triggers: [
//       { type: 'cron', periodicity: 'R/PT1H' }
//     ],
//     steps: [
//       { type: 'starlark', name: 'setup', value: `load("http", "http")\nds_presidents = load_ds("rico/famous_presidents")` },
//       { type: 'starlark', name: 'download', value: `def download(ctx):\n\treturn http.get("https://fed.gov/presidents").json` },
//       { type: 'starlark', name: 'transform', value: 'def transform(ds,ctx):\n\tds.set_body(ctx.download)' },
//       { type: 'save', name: 'save', value: '' }
//     ],
//     onCompletion: [
//       { type: 'push', value: 'https://registry.qri.cloud' },
//     ]
//   })
// }

// const logLines = NewEventLogLines([
//   { "t": EventLogLineType.ETTransformStart,          "ts": "2021-01-01T00:00:00Z", "sid": "aaaa", "p": {"id": "aaaa" }},
//   { "t": EventLogLineType.ETTransformStepStart,      "ts": "2021-01-01T00:00:01Z", "sid": "aaaa", "p": {"name": "setup" }},
//   { "t": EventLogLineType.ETVersionPulled,           "ts": "2021-01-01T00:00:10Z", "sid": "aaaa", "p": {"refstring": "rico/presidents@QmFoo", "remote": "https://registy.qri.cloud" }},
//   { "t": EventLogLineType.ETTransformStepStop,       "ts": "2021-01-01T00:00:01Z", "sid": "aaaa", "p": {"name": "setup", "status": "succeeded" }},
//   { "t": EventLogLineType.ETTransformStepStart,      "ts": "2021-01-01T00:00:01Z", "sid": "aaaa", "p": {"name": "download" }},
//   { "t": EventLogLineType.ETPrint,                   "ts": "2021-01-01T00:00:20Z", "sid": "aaaa", "p": {"msg": "oh hai there" }},
//   { "t": EventLogLineType.ETHttpRequestStop,         "ts": "2021-01-01T00:00:20Z", "sid": "aaaa", "p": {"size": 230409, "method": "GET", "url": "https://registy.qri.cloud" }},
//   { "t": EventLogLineType.ETTransformStepStop,       "ts": "2021-01-01T00:00:21Z", "sid": "aaaa", "p": {"name": "download", "status": "succeeded" }},
//   { "t": EventLogLineType.ETTransformStepStart,      "ts": "2021-01-01T00:00:21Z", "sid": "aaaa", "p": {"name": "transform" }},
//   { "t": EventLogLineType.ETTransformStepStop,       "ts": "2021-01-01T00:00:22Z", "sid": "aaaa", "p": {"name": "transform", "status": "failed", "error": "oh shit. it broke." }},
//   { "t": EventLogLineType.ETTransformStepSkip,       "ts": "2021-01-01T00:00:22Z", "sid": "aaaa", "p": {"name": "save" }},
//   { "t": EventLogLineType.ETTransformStop,           "ts": "2021-01-01T00:01:00Z", "sid": "aaaa", "p": {"status": "failed" }}
// ])

// useEffect(() => {
//   if (running) {
//     let i = 0
//     const timer = setInterval(() => {
//       i++
//       setState({
//         workflow: state.workflow,
//         run: NewRunFromEventLog("aaaa", logLines.slice(0,i)),
//       })
//       if (i === logLines.length) {
//         console.log('done running')
//         clearInterval(timer)
//         setRunning(false)
//         i = 0
//       }
//     }, 1000)
//   }
// }, [running, state.workflow])
