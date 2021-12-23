import { RUN_QUEUE_ADD, RUN_QUEUE_REMOVE } from "./runQueueState"

export interface RunQueueAction {
  type: string
  runID: string
}

export const runQueueAdd = (runID: string): RunQueueAction => {
  return {
    type: RUN_QUEUE_ADD,
    runID
  }
}

export const runQueueRemove = (runID: string): RunQueueAction => {
  return {
    type: RUN_QUEUE_REMOVE,
    runID
  }
}
