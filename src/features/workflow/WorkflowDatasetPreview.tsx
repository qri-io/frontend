import React from 'react'
import { useLocation } from 'react-router-dom'

import { Dataset, NewDataset } from '../../qri/dataset'
import { selectorFromLocationHash } from '../../qri/ref'
import TabbedComponentViewer from '../dsComponents/TabbedComponentViewer'

export interface WorkflowDatasetPreviewProps {
  dataset?: Dataset
}

const WorkflowDatasetPreview: React.FC<WorkflowDatasetPreviewProps> = ({
  dataset
}) => {
  const selectedComponent = selectorFromLocationHash(useLocation())

  return (
    <div style={{ height: '65vh' }}>
      {dataset
        ? (
          <TabbedComponentViewer
            dataset={dataset}
            selectedComponent={selectedComponent}
            preview
            showLoadingState={false}
          />
          )
        : (
          <TabbedComponentViewer
              dataset={NewDataset({})}
            >
            <div id='workflow_dataset_preview_empty_text' className='h-full w-full flex justify-center items-center text-qrigray-400 text-center'>
              Dry run your code!<br/>If everything is working, you&apos;ll see a preview of the next version of this dataset here.
            </div>
          </TabbedComponentViewer>
          )}
    </div>
  )
}

export default WorkflowDatasetPreview
