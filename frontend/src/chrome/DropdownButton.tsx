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
    <button className='relative rounded-md bg-qrilightblue hover:bg-qrilightblue-light '>
      <div className='float-right p-4 border-l' onClick={() => {setOpen(!open)}}>
        <Icon icon='sortDown'/>
      </div>
      <div className='p-4 w-52' onClick={() => {onClick(value)}}>{value.title}</div>
      {open &&
        <div className='absolute rounded-md bg-white'>
          {options.map((opt) => (
            <div key={opt.id} className='p-4 border-t' onClick={() => { onChangeValue(opt); setOpen(false) }}>
              <div className='left pr-2'>
                {(opt.id === value.id) && <Icon icon='check' />}
              </div>
              <div>
                <h5 className="font-bold">{opt.title}</h5>
                <p>{opt.description}</p>
              </div>
            </div>
          ))}
        </div>
      }
    </button>
  )
}

export default DropdownButton
