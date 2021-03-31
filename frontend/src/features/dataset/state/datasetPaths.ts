import { QriRef } from "../../../qri/ref";

export function pathToDatasetIssues(ref: QriRef): string {
  return `/ds/${ref.username}/${ref.name}/issues`
}

export function pathToDatasetPreview(ref: QriRef): string {
  return `/ds/${ref.username}/${ref.name}/preview`
}

export function pathToDatasetViewer(ref: QriRef): string {
  let urlPath = `/ds/${ref.username}/${ref.name}`
  if (ref.path) {
    urlPath += `/at${ref.path}`
  }
  urlPath += ref.component ? `/${ref.component}`  : "/body"

  return urlPath
}

export function pathToDatasetEditor(ref: QriRef): string {
  return `/ds/${ref.username}/${ref.name}/edit`
}

export function pathToWorkflowEditor(username: string, name: string): string {
  return `/ds/${username}/${name}/workflow`
}

export function pathToActivityFeed(username: string, name:string): string {
  return `/ds/${username}/${name}/history`
}