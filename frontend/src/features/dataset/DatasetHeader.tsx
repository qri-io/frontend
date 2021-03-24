import React from 'react';
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'

import Icon from '../../chrome/Icon'
import DropdownMenu from '../../chrome/DropdownMenu'
import EditableLabel from '../../chrome/EditableLabel'
import { renameDataset } from './state/datasetActions'
import { QriRef } from '../../qri/ref';

export interface DatasetHeaderProps {
  qriRef: QriRef
  editable?: boolean
}

const DatasetHeader: React.FC<DatasetHeaderProps> = ({ 
  qriRef,
  editable = false
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

  const menuItems = [
    {
      onClick: () => { handleButtonClick("duplicating not yet implemented") },
      text: 'Duplicate...',
      disabled: true
    }
  ]

  return (
    <div className="w-full mh-20 p-8 pb-2 relative">
      <div className='text-lg font-bold relative flex items-baseline group hover:text'>
        <span>{qriRef.username || 'new'} / </span>
        <EditableLabel readOnly={!editable} name='name' onChange={handleRename} value={qriRef.name} />
        {editable && <DropdownMenu items={menuItems}>
          <Icon className='ml-3 opacity-60' size='sm' icon='sortDown' />
        </DropdownMenu>}
      </div>
    </div>
  )
}

export default DatasetHeader;
