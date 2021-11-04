import React, { useState } from 'react'
import Icon from './Icon'

export interface DropdownButtonProps {
  value: Option
  options: Option[]
  onChangeValue: (value: Option<any>) => void
  onClick: (value: Option<any>) => void
  id: string
}

export interface Option<T = string> {
  value: T
  title: string
  description: string
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  id,
  value,
  options,
  onChangeValue,
  onClick
}) => {
  const [open, setOpen] = useState(false)
  return (
    <button id={id} className='relative rounded-md bg-qritile'>
      <div
        className='float-right p-3 pt-0 pb-2 rounded-tr-md rounded-br-md hover:bg-qritile-500 bg-qritile-600'
        onClick={() => { setOpen(!open) }}
      >
        <Icon icon='sortDown'/>
      </div>
      <div
        className='p-1 pr-16 pl-5 hover:bg-qritile-400 rounded-md font-bold text-white'
        onClick={() => { onClick(value) }}
      >
        {value.title}
      </div>
      {open &&
        <div className='absolute right-0 mt-2 shadow-md rounded-md bg-white overflow-hidden'>
          {options.map((opt) => (
            <div key={opt.value} className='p-4 border-b text-left w-72 hover:bg-gray-50' onClick={() => { onChangeValue(opt); setOpen(false) }}>
              <div className='left pr-2 float-left'>
                {(opt.value === value.value) && <Icon icon='check' size='sm' />}
              </div>
              <div className='pl-8'>
                <h5 className="font-bold">{opt.title}</h5>
                <p className='text-sm'>{opt.description}</p>
              </div>
            </div>
          ))}
        </div>
      }
    </button>
  )
}

export default DropdownButton
