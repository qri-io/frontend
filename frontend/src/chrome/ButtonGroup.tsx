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
  <div className='m-1 text-sm'>
    {items.map(({ text, icon, link }, i) => (
      <Link className='my-2 mx-4' key={i} to={link}>
        <Icon className='mr-1' size='md' icon={icon} />
        <span>{text}</span>
      </Link>
    ))}
  </div>
)

export default ButtonGroup
