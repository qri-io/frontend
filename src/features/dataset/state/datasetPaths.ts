import { QriRef } from "../../../qri/ref";

export function pathToDatasetIssues(ref: QriRef): string {
  return `/${ref.username}/${ref.name}/issues`
}

export function pathToDatasetHeadPreview(ref: QriRef): string {
  return `/${ref.username}/${ref.name}`
}

export function pathToDatasetPreview(ref: QriRef): string {
  let urlPath = `/${ref.username}/${ref.name}`
  if (ref.path) {
    urlPath += `/at${ref.path}`
  }

  return urlPath
}

export function pathToDatasetHistory(ref: QriRef): string {
  let urlPath = `/${ref.username}/${ref.name}`
  if (ref.path) {
    urlPath += `/at${ref.path}`
  }
  urlPath += '/history'
  urlPath += ref.component ? `#${ref.component}`  : "#body"

  return urlPath
}

export function pathToDatasetEditor(ref: QriRef): string {
  return `/${ref.username}/${ref.name}/edit`
}

export function pathToWorkflowEditor(username: string, name: string): string {
  return `/${username}/${name}/workflow`
}

export function pathToDatasetRuns(username: string, name:string): string {
  return `/${username}/${name}/runs`
}
