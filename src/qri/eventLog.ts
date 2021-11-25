export enum EventLogLineType {
  ETTransformWaiting = 'tf:Waiting',
  ETTransformStart = "tf:Start",
  ETTransformStop = "tf:Stop",
  ETTransformStepStart = "tf:StepStart",
  ETTransformStepStop = "tf:StepStop",
  ETTransformStepSkip = "tf:StepSkip",

  ETPrint = "tf:Print",
  ETError = "tf:Error",

  ETReference = "tf:Reference",
  ETDatasetPreview = "tf:DatasetPreview",
  ETChangeReport = "tf:ChangeReport",
  ETHistory = "tf:History",
  ETProfile = "tf:Profile",

  ETVersionSaved = "tf:VersionSaved",
  ETVersionPulled = "tf:VersionPulled",
  ETVersionPushed = "tf:VersionPushed",
  ETHistoryChanged = "tf:HistoryChanged",

  ETHttpRequestStart = "tf:HttpRequestStart",
  ETHttpRequestStop = "tf:HttpRequestStop",
}

export interface EventLogLine {
  type: EventLogLineType
  ts: number
  sessionID: string
  data: Record<string, any>
}

export function NewEventLogLine (data: Record<string, any>): EventLogLine {
  return {
    type: data.type,
    ts: data.ts,
    sessionID: data.sessionID,
    data: data.data
  }
}

export function NewEventLogLines (data: Array<Record<string, any>>): EventLogLine[] {
  return data.map(NewEventLogLine)
}
