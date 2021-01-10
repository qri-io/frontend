
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
  LTPrint,
  LTReference,
  LTDataset,
  LTChangeReport,
  LTHistory,
  LTProfile,

  LTVersionPulled,
  LTVersionPushed,
  LTHistoryChanged,

  LTTransformStart,
  LTTransformStop,
  LTTransformSkip,
  LTTransformStepStart,
  LTTransformStepStop,
  LTTransformStepSkip,

  LTHttpRequestStart,
  LTHttpRequestStop,
}

export interface EventLogLine {
  t: EventLogLineType
  ts: Date
  sid: string
  p: Record<string,any>
}

export function NewLogEvent(data: Record<string,any>): EventLogLine {
  return {
    t: data.t,
    ts: new Date(data.ts),
    sid: data.sid,
    p: data.p
  }
}

export function NewLogEvents(data: Record<string,any>[]): EventLogLine[] {
  return data.map(NewLogEvent)
}