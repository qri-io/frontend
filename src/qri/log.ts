import { BodyDataFormat } from "./dataset"
import { RunStatus } from "./run"

// TODO (ramfox): when "VersionInfo" contains commit title, message, runID, runDuration, and runStatus
// this field can be removed
export interface LogItem {
  commitTime: string
  commitTitle: string
  commitMessage: string

  username: string
  name: string
  profileID: string
  initID: string
  path: string

  runID: string
  runCount: number
  runDuration: number
  runStatus: RunStatus
  runStart: string

  bodySize: number
  bodyRows: number
  bodyFormat: BodyDataFormat
}

export function NewLogItem (d: Record<string, any>): LogItem {
  return {
    commitTime: d.commitTime,
    commitTitle: d.commitTitle,
    commitMessage: d.commitMessage,

    username: d.username,
    name: d.name || "",
    profileID: d.profileID,
    initID: d.initID,
    path: d.path,

    runID: d.runID,
    runCount: d.runCount,
    runDuration: d.runDuration,
    runStatus: d.runStatus,
    runStart: d.runStart,

    bodySize: d.bodySize,
    bodyRows: d.bodyRows,
    bodyFormat: d.bodyFormat
  }
}
