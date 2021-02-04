import React from 'react'

import { ComponentName, ComponentStatus } from '../../qri/dataset'
import StatusDot from '../../chrome/StatusDot'
import displayProps from './displayProps'
import Icon from '../../chrome/Icon'

export interface ComponentHeaderProps {
  componentName: ComponentName
  status?: ComponentStatus
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  componentName,
  status
}) => {

  // const qriRef = qriRefFromRoute(props)
  // const { component = '' } = qriRef
  // const { path: routePath } = useRouteMatch()
  // const statusInfo = useSelector((state: Store) => {
  //   if (isEditPath(routePath)) {
  //     return selectStatusInfoFromMutations(state, component as SelectedComponent)
  //   } else {
  //     return selectDatasetStatusInfo(state, component as SelectedComponent)
  //   }
  // })

  const { displayName, icon, tooltip } = displayProps[componentName]
  return (
    <div className='component-header'>
      <div className='component-display-name-container'>
        <div className='component-display-name' data-tip={tooltip}>
          <Icon icon={icon} size='sm'/> {displayName}
        </div>
      </div>
      <div className='status-dot-container'>
        {status && <StatusDot status={status} />}
      </div>
    </div>
  )
}

export default ComponentHeader
