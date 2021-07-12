import React from 'react'
import { useHistory } from 'react-router'

import { QriRef } from '../../qri/ref'
import Icon from '../../chrome/Icon'
import DropdownMenu from '../../chrome/DropdownMenu'
import EditableLabel from '../../chrome/EditableLabel'
import { useDispatch } from 'react-redux'
import { renameDataset } from './state/datasetActions'

export interface DatasetTitleMenuProps {
  qriRef: QriRef
  editable: boolean
}

const DatasetTitleMenu: React.FC<DatasetTitleMenuProps> = ({
  qriRef,
  editable
}) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleButtonClick = (message: string) => {
    alert(message)
  }

  const handleRename = (_:string, value:string) => {
    dispatch(renameDataset(qriRef, { username: qriRef.username, name: value }))
    // TODO(b5): we should be chaining this route replacement after successful
    // dispatch with a "then" off the renameDataset action
    const newPath = history.location.pathname.replace(qriRef.name, value)
    console.log('routing from ', history.location.pathname, ' to ', newPath)
    history.replace(newPath)
  }

  return (
    <div className="relative">
      <p className=' font-bold text-white relative flex items-baseline group hover:text'>
        <span className='opacity-70'>{qriRef.username} / </span>
        <EditableLabel readOnly={!editable} name='name' onChange={handleRename} value={qriRef.name} />
        {editable && 
          <DropdownMenu 
            icon={<Icon icon='sortDown' className='ml-3'/>}
            items={[
              {
                label: 'Duplicate...',
                disabled: true,
                onClick: () => { handleButtonClick("duplicating not yet implemented") }
              }
            ]}
          />}
      </p>
    </div>
  )
}

export default DatasetTitleMenu
