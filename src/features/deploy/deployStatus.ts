import { DeployStatus } from "../../qrimatic/workflow"

export interface DeployStatusInfo {
  statusIcon: string
  statusText: string
  color: string
  message: string
  buttonIcon: string
  buttonClass: string
  buttonText: string
}

export const deployStatusInfoMap: Record<DeployStatus,DeployStatusInfo> = {
  'undeployed': {
    statusIcon: 'deployCircle',
    statusText: 'Not Deployed',
    color: 'text-qrigray-400',
    message: 'This workflow is not deployed yet. Edit your script & use Dry Run to confirm that it is working, then Deploy it!',
    buttonIcon: 'playCircle',
    buttonClass: 'bg-qritile-600 hover:bg-qritile-700',
    buttonText: 'Deploy Workflow',
  },
  'deployed': {
    statusIcon: 'deployCircle',
    color: 'text-qrigreen',
    statusText: 'Deployed',
    message : 'This workflow is deployed and will run based on the triggers you’ve defined.',
    buttonIcon: 'pauseCircle',
    buttonClass: 'bg-gray-500 hover:bg-gray-400',
    buttonText: 'Pause Workflow'
  },
  'deploying': {
    statusIcon: 'loader',
    color: 'text-black',
    statusText: 'Deploying',
    message : '',
    buttonIcon: 'pauseCircle',
    buttonClass: 'bg-gray-500 hover:bg-gray-400',
    buttonText: 'Cancel',
  },
  'drafting': {
    statusIcon: 'deployCircle',
    statusText: 'Undeployed Changes',
    color: 'text-gray-500',
    message: 'This version is deployed, but drafted changes to this script are not yet live.',
    buttonIcon: 'playCircle',
    buttonClass: 'bg-qritile-600 hover:bg-qritile-700',
    buttonText: 'Deploy Changes',
  },
  'paused': {
    statusIcon: 'deployCircle',
    color: 'text-qrigray-400',
    statusText: 'Paused',
    message : 'This workflow is paused. All triggers will be ignored until resumed',
    buttonIcon: 'pauseCircle',
    buttonClass: 'bg-gray-500 hover:bg-gray-400',
    buttonText: 'Resume Workflow'
  },
  'failed': {
    statusIcon: 'deployCircle',
    color: 'text-dangerred',
    statusText: 'Paused',
    message : 'This workflow is paused. All triggers will be ignored until resumed',
    buttonIcon: 'pauseCircle',
    buttonClass: 'bg-gray-500 hover:bg-gray-400',
    buttonText: 'Resume Workflow'
  }
}
