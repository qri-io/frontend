import { BodyDataFormat } from "./dataset";
import { RunStatus } from "./run";

// TODO (ramfox): when "VersionInfo" contains commit title, message, runID, runDuration, and runStatus
// this field can be removed
export interface LogItem {
  timestamp: string
  title: string
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

export function NewLogItem(d: Record<string,any>): LogItem {
  return {
    timestamp: d.timestamp || d.commitTime,
    title: d.title || d.commitTitle,
    message: d.message || d.commitMessage,

    username: d.username,
    name: d.name || "",
    profileID: d.profileID,
    initID: d.initID,
    path: d.path,

    runID: d.runID,
    runNumber: d.runNumber,
    runDuration: d.runDuration,
    runStatus: d.runStatus,

    bodySize: d.bodySize,
    bodyRows: d.bodyRows,
    changeAmount: d.changeAmount,
  }
}