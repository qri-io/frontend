import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import WorkflowOutline from './WorkflowOutline';
import { selectLatestRun, selectWorkflow } from './state/workflowState';
import { loadWorkflowByDatasetRef, setWorkflow, setWorkflowRef } from './state/workflowActions';
import { selectTemplate } from '../template/templates';
import { QriRef } from '../../qri/ref';
import { ModalType } from '../app/state/appState';
import { showModal } from '../app/state/appActions';
import WorkflowEditor from './WorkflowEditor';

interface WorkflowLocationState {
  template: string
}

export interface WorkflowProps {
  qriRef: QriRef
}

const Workflow: React.FC<WorkflowProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  const location = useLocation<WorkflowLocationState>()
  const workflow = useSelector(selectWorkflow)
  const latestRun = useSelector(selectLatestRun)

  useEffect(() => {
    if (location.state && location.state.template) {
      dispatch(setWorkflow(selectTemplate(location.state.template)))
    }
  }, [dispatch, location.state])

  useEffect(() => {
    // TODO (b5) - highly-unlikely but possible race condition here. loading workflow
    // should be chained in a promise
    dispatch(setWorkflowRef(qriRef))
    dispatch(loadWorkflowByDatasetRef(qriRef))
  }, [dispatch, qriRef])

  const handleDeploy = () => {
    dispatch(showModal(ModalType.deployWorkflow))
  }

  return (
    <div className='flex h-full'>
      <WorkflowOutline workflow={workflow} run={latestRun} onDeploy={handleDeploy} />
      <WorkflowEditor workflow={workflow} run={latestRun} />
    </div>
  )
}

export default Workflow;
