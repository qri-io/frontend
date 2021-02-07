import { DeployStatus } from "../../qrimatic/workflow"

export interface DeployStatusInfo {
  statusIcon: string
  statusText: string
  statusIconClass: string
  message: string
  buttonIcon: string
  buttonClass: string
  buttonText: string
}

export const deployStatusInfoMap: Record<DeployStatus,DeployStatusInfo> = {
  'undeployed': {
    statusIcon: 'circle',
    statusText: 'Not Deployed',
    statusIconClass: 'text-gray-500',
    message: 'This workflow is not deployed yet. Edit your script here, use a Dry Run to confirm that it is working, then Deploy it!',
    buttonIcon: 'playCircle',
    buttonClass: 'bg-qrilightblue hover:bg-qrilightblue-light',
    buttonText: 'Deploy Workflow',
  },
  'deployed': {
    statusIcon: 'playCircle',
    statusIconClass: 'text-green-500',
    statusText: 'Deployed',
    message : 'This workflow is deployed and will run based on the triggers you’ve defined.',
    buttonIcon: 'pauseCircle',
    buttonClass: 'bg-gray-500 hover:bg-gray-400',
    buttonText: 'Pause Workflow'
  },
  'deploying': {
    statusIcon: 'playCircle',
    statusIconClass: 'text-green-500',
    statusText: 'Deploying',
    message : '',
    buttonIcon: 'pauseCircle',
    buttonClass: 'bg-gray-500 hover:bg-gray-400',
    buttonText: 'Cancel'
  },
  'drafting': {
    statusIcon: 'circle',
    statusText: 'Undeployed Changes',
    statusIconClass: 'text-gray-500',
    message: 'This version is deployed, but drafted changes to this script are not yet live.',
    buttonIcon: 'playCircle',
    buttonClass: 'bg-qrilightblue hover:bg-qrilightblue-light',
    buttonText: 'Deploy Changes',
  },
  'paused': {
    statusIcon: 'playCircle',
    statusIconClass: 'text-green-500',
    statusText: 'Paused',
    message : 'This workflow is paused. All triggers will be ignored until resumed',
    buttonIcon: 'pauseCircle',
    buttonClass: 'bg-gray-500 hover:bg-gray-400',
    buttonText: 'Resume Workflow'
  }
}