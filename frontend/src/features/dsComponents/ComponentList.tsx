import React from 'react'

import Dataset, { ComponentStatus, ComponentName } from '../../qri/dataset'
import ComponentItem from './ComponentItem'

// import { Status, SelectedComponent, ComponentStatus, RouteProps } from '../../models/store'
// import { pathToDataset } from '../../paths'
// import { QriRef, qriRefFromRoute } from '../../models/qriRef'
// import { selectDatasetStatus, selectDatasetComponentsList } from '../../selections'
// import { components as componentsInfo } from './WorkingComponentList'


export const componentsInfo = [
  {
    name: 'body',
    displayName: 'Data',
    tooltip: 'the structured content of the dataset',
    icon: 'body'
  },
  {
    name: 'structure',
    displayName: 'Structure',
    tooltip: 'the structure of the dataset',
    icon: 'structure'
  },
  {
    name: 'readme',
    displayName: 'Readme',
    tooltip: 'a markdown file to familiarize people with the dataset',
    icon: 'readme'
  },
  {
    name: 'meta',
    displayName: 'Meta',
    tooltip: 'the dataset\'s title, description, tags, etc',
    icon: 'tags'
  },
  {
    name: 'transform',
    displayName: 'Script',
    tooltip: 'automation script',
    icon: 'brackets'
  }
]

export interface ComponentListProps {
  // qriRef: QriRef
  dataset: Dataset
  onClick: (component: ComponentName) => void
  // components?: SelectedComponent[]
  // status: Status
  selectedComponent: ComponentName
  // if true components that don't exist will be clickable
  allowClickMissing?: boolean
}

const ComponentList: React.FC<ComponentListProps> = ({
  dataset,
  onClick,
  // qriRef,
  // status,
  // components = [],
  selectedComponent,
  // history
  allowClickMissing = false,
}) => {
  const componentNames = Object.keys(dataset)

    return (
    <div className='flex w-full'>
      {componentsInfo.map(({ name, displayName, tooltip, icon }) => {
          if (allowClickMissing || componentNames.includes(name)) {
            var fileStatus: ComponentStatus = 'unmodified'
            // if (status[name]) {
            //   fileStatus = status[name].status
            // }

            return (
              <ComponentItem
                key={name}
                name={name}
                displayName={displayName}
                icon={icon}
                status={fileStatus}
                selected={selectedComponent === name}
                tooltip={tooltip}
                onClick={onClick}
              />
            )
          }
          return (
            <ComponentItem
              key={name}
              displayName={displayName}
              icon={icon}
              disabled
            />
          )
        })
      }
    </div>
  )
}

export default ComponentList
