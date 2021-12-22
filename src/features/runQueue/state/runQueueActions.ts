import { RUN_QUEUE_ADD, RUN_QUEUE_REMOVE } from "./runQueueState"

interface RunQueueAddAction {
  type: string
  initID: string
  runID: string
}

interface RunQueueRemoveAction {
  type: string
  initID: string
}

export const runQueueAdd = (initID: string, runID: string): RunQueueAddAction => {
  return {
    type: RUN_QUEUE_ADD,
    initID,
    runID
  }
}

export const runQueueRemove = (initID: string): RunQueueRemoveAction => {
  return {
    type: RUN_QUEUE_REMOVE,
    initID
  }
}
