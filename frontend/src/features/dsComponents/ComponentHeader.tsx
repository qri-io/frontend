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
    <div className='flex-grow text-sm'>
      <div className='flex text-sm items-center px-3 py-4'>
        <div className='w-4 mr-2 text-center' data-tip={tooltip}>
          <Icon icon={icon} size='sm'/>
        </div>
        <div className='font-bold'>
          {displayName}
        </div>
      </div>
      <div className='flex-none'>
        {status && <StatusDot status={status} />}
      </div>
    </div>
  )
}

export default ComponentHeader
