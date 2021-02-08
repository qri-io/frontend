import React, { useState } from 'react'
import Icon from './Icon'

export interface DropdownButtonProps {
  value: Option
  options: Option[]
  onChangeValue: (value: Option) => void
  onClick: (value: Option) => void
}

export interface Option {
  id: string
  title: string
  description: string
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  value,
  options,
  onChangeValue,
  onClick
}) => {
  const [open, setOpen] = useState(false)
  return (
    <button className='relative rounded-md bg-qriblue'>
      <div
        className='float-right p-3 pt-0 pb-2 rounded-tr-md rounded-br-md hover:bg-qriblue-500 bg-qriblue-600'
        onClick={() => {setOpen(!open)}}
      >
        <Icon color='light' icon='sortDown'/>
      </div>
      <div
        className='p-1 pr-16 pl-5 hover:bg-qriblue-400 rounded-md font-bold text-white'
        onClick={() => {onClick(value)}}
      >
        {value.title}
      </div>
      {open &&
        <div className='absolute right-0 mt-2 shadow-md rounded-md bg-white overflow-hidden'>
          {options.map((opt) => (
            <div key={opt.id} className='p-4 border-b text-left w-72 hover:bg-gray-50' onClick={() => { onChangeValue(opt); setOpen(false) }}>
              <div className='left pr-2 float-left'>
                {(opt.id === value.id) && <Icon icon='check' size='sm' />}
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
