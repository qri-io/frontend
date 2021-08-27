import React, { useState } from 'react'

import { Dataset, ComponentName, NewDataset } from  '../../qri/dataset'
import TabbedComponentViewer from '../dsComponents/TabbedComponentViewer'

export interface WorkflowDatasetPreviewProps {
  dataset: Dataset
}

const WorkflowDatasetPreview: React.FC<WorkflowDatasetPreviewProps> = ({
  dataset
}) => {

  const [ selectedComponent, setSelectedComponent ] = useState<ComponentName>('body')

  return (
    <div style={{ height: '65vh' }}>
      {dataset ? (
        <TabbedComponentViewer
          dataset={dataset}
          loading={false}
          selectedComponent={selectedComponent}
          setSelectedComponent={(component: ComponentName) => { setSelectedComponent(component) }}
          border
          preview
        />
      ) : (
        <TabbedComponentViewer
          dataset={NewDataset({})}
          border
        >
          <div id='workflow_dataset_preview_empty_text' className='h-full w-full flex justify-center items-center text-qrigray-400 text-center'>
            Dry run your code!<br/>If everything is working, you'll see a preview of the next version of this dataset here.
          </div>
        </TabbedComponentViewer>
      )}
    </div>
  )
}

export default WorkflowDatasetPreview
