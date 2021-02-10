import React, { useState } from 'react'

import { QriRef } from '../../qri/ref'
import Icon from '../../chrome/Icon'
import DropdownMenu from '../../chrome/DropdownMenu'

export interface DatasetTitleMenuProps {
  qriRef: QriRef
}

const DatasetTitleMenu: React.FC<DatasetTitleMenuProps> = ({
  qriRef
}) => {

  const handleButtonClick = (message: string) => {
    alert(message)
  }

  const menuItems = [
    {
      onClick: () => { handleButtonClick("renaming not yet implemented") },
      text: 'Rename...',
      disabled: true
    },
    {
      onClick: () => { handleButtonClick("duplicating not yet implemented")},
      text: 'Duplicate...',
      disabled: true
    }
  ]

  return (
    <div className="relative">
      <DropdownMenu items={menuItems}>
        <p className=' font-bold text-white relative flex items-baseline group hover:text'>
          <span className='opacity-70'>{qriRef.username} / </span> {qriRef.name}<Icon icon='sortDown' className='ml-3'/>
        </p>
      </DropdownMenu>
    </div>
  )
}

export default DatasetTitleMenu
