import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'

import Icon from '../../chrome/Icon'
import DropdownMenu from '../../chrome/DropdownMenu'
import EditableLabel from '../../chrome/EditableLabel'
import { renameDataset } from './state/datasetActions'
import { Dataset, qriRefFromDataset } from '../../qri/dataset'
import DatasetInfoItem from './DatasetInfoItem'
import Button from '../../chrome/Button'

export interface DatasetHeaderProps {
  dataset: Dataset
  border?: boolean
  editable?: boolean
}

const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  dataset,
  border = false,
  editable = false
}) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleButtonClick = (message: string) => {
    alert(message)
  }

  const qriRef = qriRefFromDataset(dataset)

  const handleRename = (_:string, value:string) => {
    dispatch(renameDataset(qriRef, { username: dataset.username, name: value }))
    // TODO(b5): we should be chaining this route replacement after successful
    // dispatch with a "then" off the renameDataset action
    const newPath = history.location.pathname.replace(dataset.name, value)
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
    <div className="w-full">
      <div className='flex'>
        <div className='flex-grow'>
          <div className='text-md text-gray-400 relative flex items-baseline group hover:text pb-1 font-mono'>
            <span>{qriRef.username || 'new'}/</span>
            <EditableLabel readOnly={!editable} name='name' onChange={handleRename} value={qriRef.name} />
            {editable && <DropdownMenu items={menuItems}>
              <Icon className='ml-3 opacity-60' size='sm' icon='sortDown' />
            </DropdownMenu>}
          </div>

          <div className='text-2xl text-qrinavy-500 font-black group hover:text mb-3'>
            {dataset.meta?.title || dataset.name}
          </div>

          <div className='flex mb-5'>
            <DatasetInfoItem icon='automationFilled' label='automated' iconClassName='text-qrigreen' />
            <DatasetInfoItem icon='disk' label='59 MB' />
            <DatasetInfoItem icon='download' label='418 downloads' />
            <DatasetInfoItem icon='follower' label='130 followers' />
            <DatasetInfoItem icon='lock' label='private' />
          </div>
        </div>
        <div className='flex items-center content-center'>
          <Button className='mr-3' type='light' filled={false}>
            Follow
          </Button>
          <Button type='secondary'>
            <Icon icon='globe' size='lg' className='mr-2' /> Share
          </Button>
          <Icon icon='ellipsesVertical' size='lg' className='ml-2' />
        </div>
      </div>
      {border && <div className='border-b-2' />}
    </div>
  )
}

export default DatasetHeader;
