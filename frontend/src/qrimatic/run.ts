import { EventLogLine, EventLogLineType } from "./eventLog"

export enum RunState {
  waiting = 'waiting',
  running = 'running',
  succeeded = 'succeeded',
  failed = 'failed',
  skipped = 'skipped'
}

export interface Run {
  id: string
  status: RunState
  startTime?: Date
  stopTime?: Date
  duration?: string

  steps: RunStep[]
}

export function NewRun(data: Record<string,any>): Run {
  return {
    id: data.id || '',
    status: data.status || RunState.waiting,
    steps: data.steps && data.steps.map(NewRunStep)
  }
}

export interface RunStep {
  status: RunState
  startTime?: Date
  stopTime?: Date
  duration?: string
  output?: EventLogLine[]
}

export function NewRunStep(data: Record<string, any>): RunStep {
  return {
    status: data.status,
    startTime: data.started,
    stopTime: data.stopped,
    duration: data.duration,
    output: data.output
  }
}

export function NewRunFromEventLog(runID: string, log: EventLogLine[]): Run {
  return log.reduce(runAddLogStep, NewRun({ id: runID }))
}

export function runAddLogStep(run: Run, line: EventLogLine): Run {
  if (run.id !== line.sid) {
    return run
  }

  switch (line.t) {
    case EventLogLineType.LTTransformStart:
      run.status = RunState.running
      run.startTime = line.ts
      run.id = line.p && line.p.id
      break;
    case EventLogLineType.LTTransformStop:
      run.status = line.p.status || RunState.failed
      run.stopTime = line.ts
      break;
    case EventLogLineType.LTTransformSkip:
      // TODO (b5)
      break;

    case EventLogLineType.LTTransformStepStart:
      if (run.steps === undefined) {
        run.steps = []
      }
      const s = NewRunStep(line.p)
      s.status = RunState.running
      s.startTime = line.ts
      run.steps.push(s)
      break;
    case EventLogLineType.LTTransformStepStop:
      const step = lastStep(run)
      if (step) {
        step.stopTime = line.ts
        step.status = line.p.status || RunState.failed
      }
      break;
    case EventLogLineType.LTTransformStepSkip:
      if (run.steps === undefined) {
        run.steps = []
      }
      run.steps.push(NewRunStep(line.p))
      break;

    case EventLogLineType.LTPrint:
    case EventLogLineType.LTDataset:
    case EventLogLineType.LTHttpRequestStop:
    case EventLogLineType.LTVersionPulled:
      appendStepOutputLog(run, line)
      break;
  }
  return run
}

function lastStep(run: Run): RunStep | undefined {
  if (run.steps && run.steps.length > 0)  {
    return run.steps[run.steps.length - 1]
  }
  return undefined
}

function appendStepOutputLog(run: Run, line: EventLogLine) {
  const step = lastStep(run)
  if (step) {
    step.output ? step.output.push(line) : step.output = [line]
  }
}
