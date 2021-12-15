export interface RunQueueAction {
  type: string
  runID: string
  initID: string
}

export function runQueuePush (runID: string, initID: string): RunQueueAction {
  return {
    type: RUN_QUEUE_PUSH,
    runID,
    initID
  }
}

export function runQueuePop (runID: string, initID: string): RunQueueAction {
  return {
    type: RUN_QUEUE_POP,
    runID,
    initID
  }
}
