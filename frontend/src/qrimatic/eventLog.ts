
// [
//   { "t": "transform-start",        "ts": "2021-01-01T00:00:00Z", "sid": "aaaa", "p": {"id": "aaaa" }},
//   { "t": "transform-step-start",   "ts": "2021-01-01T00:00:01Z", "sid": "aaaa", "p": {"name": "setup" }},
//   { "t": "dataset-pull",           "ts": "2021-01-01T00:00:10Z", "sid": "aaaa", "p": {"refstring": "rico/presidents@QmFoo", "remote": "https://registy.qri.cloud" }},
//   { "t": "transform-step-end",     "ts": "2021-01-01T00:00:01Z", "sid": "aaaa", "p": {"name": "setup", "status": "succeeded" }},
//   { "t": "transform-step-start",   "ts": "2021-01-01T00:00:01Z", "sid": "aaaa", "p": {"name": "download" }},
//   { "t": "log",                    "ts": "2021-01-01T00:00:20Z", "sid": "aaaa", "p": {"msg": "oh hai there" }},
//   { "t": "http-request-completed", "ts": "2021-01-01T00:00:20Z", "sid": "aaaa", "p": {"size": 230409, "method": "GET", "url": "https://registy.qri.cloud" }},
//   { "t": "transform-step-stop",    "ts": "2021-01-01T00:00:21Z", "sid": "aaaa", "p": {"name": "download", "status": "succeeded" }},
//   { "t": "transform-step-start",   "ts": "2021-01-01T00:00:21Z", "sid": "aaaa", "p": {"name": "transform" }},
//   { "t": "transform-step-stop",    "ts": "2021-01-01T00:00:22Z", "sid": "aaaa", "p": {"name": "transform", "status": "failed", "error": "oh shit. it broke." }},
//   { "t": "transform-step-skipp",   "ts": "2021-01-01T00:00:22Z", "sid": "aaaa", "p": {"name": "save" }},
//   { "t": "transform-ended",        "ts": "2021-01-01T00:01:00Z", "sid": "aaaa", "p": {"status": "failed" }}
// ]

export enum EventLogLineType {
  ETDebug = "transform:Debug",
  ETPrint = "transform:Print",
  ETWarn = "transform:Warn",
  ETError = "transform:Error",
  ETReference = "transform:Reference",
  ETDataset = "transform:Dataset",
  ETChangeReport = "transform:ChangeReport",
  ETHistory = "transform:History",
  ETProfile = "transform:Profile",

  ETVersionSaved = "transform:VersionSaved",
  ETVersionPulled = "transform:VersionPulled",
  ETVersionPushed = "transform:VersionPushed",
  ETHistoryChanged = "transform:HistoryChanged",
  
  ETTransformStart = "transform:TransformStart",
  ETTransformStop = "transform:TransformStop",
  ETTransformSkip = "transform:TransformSkip",
  ETTransformStepStart = "transform:TransformStepStart",
  ETTransformStepStop = "transform:TransformStepStop",
  ETTransformStepSkip = "transform:TransformStepSkip",

  ETHttpRequestStart = "transform:HttpRequestStart",
  ETHttpRequestStop = "transform:HttpRequestStop",
}

export interface EventLogLine {
  type: EventLogLineType
  ts: number
  sid: string
  data: Record<string,any>
}

export function NewEventLogLine(data: Record<string,any>): EventLogLine {
  return {
    type: data.type,
    ts: data.ts,
    sid: data.sid,
    data: data.data
  }
}

export function NewEventLogLines(data: Record<string,any>[]): EventLogLine[] {
  return data.map(NewEventLogLine)
}