export enum EventLogLineType {
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
  timestamp: number
  sessionID: string
  payload: Record<string, any>
}

export function NewEventLogLine (data: Record<string, any>): EventLogLine {
  return {
    type: data.type,
    timestamp: data.timestamp,
    sessionID: data.sessionID,
    payload: data.payload
  }
}

export function NewEventLogLines (data: Array<Record<string, any>>): EventLogLine[] {
  return data.map(NewEventLogLine)
}
