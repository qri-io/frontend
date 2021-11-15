import React from 'react'
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

import IconButton from "../../../chrome/IconButton"
import { clearModal } from "../../app/state/appActions"
import { trackGoal } from "../../analytics/analytics"
import { resetDatasetState } from "../state/datasetActions"
import { resetManualDatasetCreationState } from "../../manualDatasetCreation/state/manualDatasetCreationActions"

const NewDatasetModal: React.FC<{}> = () => {
  const onLinkClick = (resetManualState?: boolean) => {
    dispatch(clearModal())
    dispatch(resetDatasetState())
    if (resetManualState) {
      dispatch(resetManualDatasetCreationState())
    }
  }

  const dispatch = useDispatch()
  return (
    <div className='p-8 max-w-lg'>
      <div className='flex mb-1.5 items-center'>
        <h1 className='font-extrabold text-3xl mr-4' style={{ width: 356, lineHeight: '36px' }}>New Dataset</h1>
        <IconButton icon='close' onClick={() => dispatch(clearModal())} />
      </div>
      <p className='text-qrigray-400 text-md mb-4'>You can create a Dataset throught different options</p>
      <Link
        id='new_dataset_modal_create_workflow'
        className='cursor-pointer mb-4 inline-block w-full'
        to={{
          pathname: `/workflow/new`,
          state: {
            showSplashModal: true,
            template: 'CSVDownload'
          }
        }}
        onClick={() => {
          // general-click-new-dataset-button event
          onLinkClick()
          trackGoal('KHBCRTHJ', 0)
        }}
      >
        <div className='border rounded p-3 border-black  text-sm'>
          <h6 className='font-bold'>Create from Workflow</h6>
          <p className='text-qrigray-400'>Create a new dataset from a workflow</p>
        </div>
      </Link>
      <Link
        className='cursor-pointer inline-block w-full'
        to={{
          pathname: '/dataset/new'
        }}
        onClick={() => {
          onLinkClick(true)
        }}
      >
        <div className='border rounded p-3 border-black  text-sm'>
          <h6 className='font-bold'>Manual Upload</h6>
          <p className='text-qrigray-400'>Upload a new dataset from a dataset that you already have</p>
        </div>
      </Link>
    </div>
  )
}

export default NewDatasetModal
