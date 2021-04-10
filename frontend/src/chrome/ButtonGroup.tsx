import React from 'react'
import { Link } from 'react-router-dom'

import Icon from './Icon'

export interface ButtonGroupProps {
  items: ButtonGroupItem[]
}

export interface ButtonGroupItem {
  text: string
  icon: string
  link: string
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  items,
}) => (
  <div className='m-1'>
    {items.map(({ text, icon, link }, i) => (
      <Link className='my-2 mx-4 font-medium text-qrinavy' key={i} to={link}>
        <Icon className='mr-2' size='md' icon={icon} />
        <span style={{ fontSize: '16px' }}>{text}</span>
      </Link>
    ))}
  </div>
)

export default ButtonGroup
