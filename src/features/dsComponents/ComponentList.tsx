import React from 'react'
import classNames from 'classnames'

import Dataset, { ComponentStatus, ComponentName } from '../../qri/dataset'
import ComponentItem from './ComponentItem'

// import { Status, SelectedComponent, ComponentStatus, RouteProps } from '../../models/store'
// import { pathToDataset } from '../../paths'
// import { QriRef, qriRefFromRoute } from '../../models/qriRef'
// import { selectDatasetStatus, selectDatasetComponentsList } from '../../selections'
// import { components as componentsInfo } from './WorkingComponentList'

interface ComponentInfo {
  name: ComponentName,
  displayName: string,
  tooltip: string,
  icon: string
}

export const componentsInfo:ComponentInfo[] = [
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
  // components?: SelectedComponent[]
  // status: Status
  selectedComponent?: ComponentName
  // if true components that don't exist will be clickable
  allowClickMissing?: boolean
  // for showing a gray border around the selected tab to contrast with white background
  border?: boolean
}

const ComponentList: React.FC<ComponentListProps> = ({
  dataset,
  // qriRef,
  // status,
  // components = [],
  selectedComponent,
  // history
  allowClickMissing = false,
  border = false,
}) => {
  const componentNames = Object.keys(dataset)

    return (
    <div className={classNames('flex w-full', { 'border-b-2': border })}>
      {componentsInfo.map(({ name, displayName, tooltip, icon }) => {
          if (allowClickMissing || componentNames.includes(name) || ( name==='body' && dataset.bodyPath )) {
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
                border={border}
              />
            )
          }
          return (
            <ComponentItem
              key={name}
              displayName={displayName}
              icon={icon}
              border={border}
              disabled
            />
          )
        })
      }
    </div>
  )
}

export default ComponentList
