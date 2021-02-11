import { ComponentName } from "../../../qri/dataset";

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