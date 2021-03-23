import { ComponentName } from "../../../qri/dataset";
import { QriRef } from "../../../qri/ref";

export function pathToDatasetIssues(ref: QriRef): string {
  return `/ds/${ref.username}/${ref.name}/issues`
}

export function pathToDatasetPreview(ref: QriRef): string {
  return `/ds/${ref.username}/${ref.name}/preview`
}

export function pathToDatasetViewer(username: string, name: string, componentName?: ComponentName): string {
  return componentName
    ? `/ds/${username}/${name}/components/${componentName}`
    : `/ds/${username}/${name}/components`
}

export function pathToWorkflowEditor(username: string, name: string): string {
  return `/ds/${username}/${name}/workflow`
}

export function pathToActivityFeed(username: string, name:string): string {
  return `/ds/${username}/${name}/history`
}