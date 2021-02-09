import { RunStatus } from "./run";

export interface LogItem {
  timestamp: string
  message: string

  username: string
  name: string
  profileID: string
  initID: string
  path: string

  runID: string
  runNumber: number
  runDuration: number
  runStatus: RunStatus

  bodySize: number
  bodyRows: number
  changeAmount: number
}
