import React from 'react'

import Dataset from '../../qri/dataset'
import ComponentItem from './ComponentItem'
import { datasetComponents, ComponentStatus } from '../../qri/dataset'

// import { Status, SelectedComponent, ComponentStatus, RouteProps } from '../../models/store'
// import { pathToDataset } from '../../paths'
// import { QriRef, qriRefFromRoute } from '../../models/qriRef'
// import { selectDatasetStatus, selectDatasetComponentsList } from '../../selections'
// import { components as componentsInfo } from './WorkingComponentList'


export const componentsInfo = [
  {
    name: 'commit',
    displayName: 'Commit',
    tooltip: 'info about the latest changes to the dataset',
    icon: 'commit'
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
    icon: 'meta'
  },
  {
    name: 'body',
    displayName: 'Body',
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
    name: 'transform',
    displayName: 'Transform',
    tooltip: 'automation script',
    icon: 'transform'
  }
]

export interface ComponentListProps {
  // qriRef: QriRef
  dataset: Dataset
  // components?: SelectedComponent[]
  // status: Status
  // selectedComponent: SelectedComponent
}

const ComponentList: React.FC<ComponentListProps> = ({
  dataset
  // qriRef,
  // status,
  // components = [],
  // selectedComponent,
  // history
}) => {
  // const {
  //   username = '',
  //   name: datasetName = '',
  //   path = ''
  // } = qriRef

  const components = datasetComponents(dataset)

  return (
    <div>
      {componentsInfo.map(({ name, displayName, tooltip, icon }) => {
          if (components.includes(name)) {
            var fileStatus: ComponentStatus = 'unmodified'
            // if (status[name]) {
            //   fileStatus = status[name].status
            // }

            return (
              <ComponentItem
                key={name}
                displayName={displayName}
                icon={icon}
                status={fileStatus}
                // selected={selectedComponent === name}
                // selected={false}
                tooltip={tooltip}
                // onClick={(component: SelectedComponent) => history.push(pathToDataset(username, datasetName, path, component))}
                onClick={() => {}}
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
