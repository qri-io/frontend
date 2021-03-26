import { QriRef } from "../../../qri/ref";

export function pathToDatasetIssues(ref: QriRef): string {
  return `/ds/${ref.username}/${ref.name}/issues`
}

export function pathToDatasetPreview(ref: QriRef): string {
  return `/ds/${ref.username}/${ref.name}/preview`
}

export function pathToDatasetViewer(ref: QriRef): string {
  let path = `/ds/${ref.username}/${ref.name}`
  if (ref.path) {
    path += `/at${ref.path}`
  }
  path += ref.component || "/body"

  return path
}

export function pathToWorkflowEditor(username: string, name: string): string {
  return `/ds/${username}/${name}/workflow`
}

export function pathToActivityFeed(username: string, name:string): string {
  return `/ds/${username}/${name}/history`
}