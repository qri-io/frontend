import React from 'react'
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

import IconButton from "../../../chrome/IconButton"
import { clearModal } from "../../app/state/appActions"
import { trackGoal } from "../../analytics/analytics"
import { resetDatasetState } from "../state/datasetActions"
import { resetDatasetEditorState } from "../../datasetEditor/state/datasetEditorActions"

const NewDatasetModal: React.FC<{}> = () => {
  const onLinkClick = (resetManualState?: boolean) => {
    dispatch(clearModal())
    dispatch(resetDatasetState())
    if (resetManualState) {
      dispatch(resetDatasetEditorState())
    }
  }

  const dispatch = useDispatch()
  return (
    <div className='p-8' style={{ width: 450 }}>
      <div className='flex mb-1.5 items-start'>
        <h1 className='font-extrabold text-3xl mr-4' style={{ lineHeight: '36px' }}>Let&apos;s make a dataset</h1>
        <IconButton icon='close' className='ml-2 mt-2' onClick={() => dispatch(clearModal())} />
      </div>
      <p className='text-qrigray-400 text-md mb-4'>You can upload a file, or use code to build a dataset from external sources.</p>
      <Link
        id='new_dataset_modal_create_workflow'
        className='cursor-pointer mb-4 inline-block w-full'
        to={{
          pathname: `/automation/new`,
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
        <div className='border rounded p-3 border-black text-sm hover:border-qripink-700 transition-all duration-100 group'>
          <h6 className='font-bold group-hover:text-qripink-700 transition-all duration-100'>Automated Dataset</h6>
          <p className='text-qrigray-400'>You can write code to download and transform external data, and schedule updates</p>
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
        <div className='border rounded p-3 border-black text-sm hover:border-qripink-700 transition-all duration-100 group'>
          <h6 className='font-bold group-hover:text-qripink-700 transition-all duration-100'>Manual Dataset</h6>
          <p className='text-qrigray-400'>Upload a CSV or JSON file from your computer</p>
        </div>
      </Link>
    </div>
  )
}

export default NewDatasetModal
