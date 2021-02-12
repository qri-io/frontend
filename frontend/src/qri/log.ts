import { BodyDataFormat } from "./dataset";
import { RunStatus } from "./run";

// TODO (ramfox): when "VersionInfo" contains commit title, message, runID, runDuration, and runStatus
// this field can be removed
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
  bodyFormat: BodyDataFormat
  changeAmount: number
}
