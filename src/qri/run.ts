import { EventLogLine, EventLogLineType } from "./eventLog"
import { Dataset, NewDataset } from './dataset'

export type RunStatus =
  | 'waiting'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'unchanged'
  | 'skipped'
  | '' // empty status indicates a manual change

export interface Run {
  id: string
  status: RunStatus
  startTime?: Date
  stopTime?: Date
  duration?: number // duration of the run in nanoseconds
  initID?: string
  steps: RunStep[]
  dsPreview?: Dataset
}

export function NewRun (data: Record<string, any>): Run {
  return {
    id: data.id || '',
    status: data.status || 'waiting',
    steps: data.steps && data.steps.map(NewRunStep)
  }
}

export function NewRunFromEventLog (runID: string, log: EventLogLine[]): Run {
  return log.reduce(runAddLogStep, NewRun({ id: runID }))
}

export interface RunStep {
  id: string
  name: string
  category: string
  status: RunStatus
  startTime?: Date
  stopTime?: Date
  duration?: number // duration of the step in nanoseconds
  output?: EventLogLine[]
}

export function NewRunStep (data: Record<string, any>): RunStep {
  return {
    id: data.sessionID,
    name: data.name,
    category: data.category,
    status: data.status,
    startTime: data.started,
    stopTime: data.stopped,
    duration: data.duration,
    output: data.output
  }
}

export function toMilliFromNano (na: number): number {
  return na / 1000000
}

function toNanoFromMilli (mi: number): number {
  return mi * 1000000
}

export function runAddLogStep (run: Run, line: EventLogLine): Run {
  if (run.id !== line.sessionID) {
    return run
  }

  switch (line.type) {
    case EventLogLineType.ETTransformStart:
      run.status = 'running'
      run.initID = line.data.initID
      run.startTime = new Date(toMilliFromNano(line.ts))
      run.steps = []
      break
    case EventLogLineType.ETTransformStop:
      run.initID = line.data.initID
      run.status = line.data.status || 'failed'
      run.stopTime = new Date(toMilliFromNano(line.ts))
      if (run.startTime) {
        run.duration = toNanoFromMilli(run.startTime?.getTime() - run.stopTime?.getTime())
      }
      break

    case EventLogLineType.ETTransformStepStart:
      if (run.steps === undefined) {
        run.steps = []
      }
      const s = NewRunStep(line.data)
      s.status = 'running'
      s.startTime = new Date(line.ts)
      run.steps.push(s)
      break
    case EventLogLineType.ETTransformStepStop:
      const step = lastStep(run)
      if (step) {
        step.stopTime = new Date(line.ts)
        step.status = line.data.status || 'failed'
        if (step.startTime) {
          step.duration = toNanoFromMilli(step.stopTime.getTime() - step.startTime.getTime())
        }
      }
      break
    case EventLogLineType.ETTransformStepSkip:
      if (run.steps === undefined) {
        run.steps = []
      }
      run.steps.push(NewRunStep(line.data))
      break

    case EventLogLineType.ETPrint:
    case EventLogLineType.ETError:
    case EventLogLineType.ETReference:
    case EventLogLineType.ETChangeReport:
    case EventLogLineType.ETHistory:
    case EventLogLineType.ETProfile:
    case EventLogLineType.ETHttpRequestStop:
    case EventLogLineType.ETVersionPulled:
      appendStepOutputLog(run, line)
      break

    case EventLogLineType.ETDatasetPreview:
      run.dsPreview = NewDataset(line.data)
  }
  return run
}

function lastStep (run: Run): RunStep | undefined {
  if (run.steps && run.steps.length > 0) {
    return run.steps[run.steps.length - 1]
  }
  return undefined
}

function appendStepOutputLog (run: Run, line: EventLogLine) {
  const step = lastStep(run)
  if (step) {
    step.output ? step.output.push(line) : step.output = [line]
  }
}
