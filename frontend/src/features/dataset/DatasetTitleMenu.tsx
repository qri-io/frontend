import React, { useState } from 'react'

import { QriRef } from '../../qri/ref'
import Icon from '../../chrome/Icon'

export interface DatasetTitleMenuProps {
  qriRef: QriRef
}

const DatasetTitleMenu: React.FC<DatasetTitleMenuProps> = ({
  qriRef
}) => {
  const [open,setOpen] = useState(false)

  return (
    <div className="relative">
      <p onClick={()=> { setOpen(!open)}} className='cursor-pointer font-bold text-white relative flex items-baseline group hover:text'>
        <span className='opacity-70'>{qriRef.username} / </span> {qriRef.name}<Icon icon='sortDown' className='ml-3'/>
      </p>
      {open && <div className="group-hover:text-white origin-bottom-right absolute right-0 top-8 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-20" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <div className="py-1">
          <button 
            onClick={() => { alert("renaming not yet implemented") }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" 
            role="menuitem">Rename</button>
          <button 
            onClick={() => { alert("duplicating not yet implemented") }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem">Duplicate</button>
        </div>
      </div>}
    </div>
  )
}

export default DatasetTitleMenu