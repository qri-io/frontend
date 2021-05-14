import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Icon from './Icon'

export interface ButtonGroupProps {
  items: ButtonGroupItem[]
  currentPathname: string
}

export interface ButtonGroupItem {
  text: string
  icon: string
  link: string
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  items,
  currentPathname
}) => (
  <div className='m-1 flex'>
    {items.map(({ text, icon, link }, i) => {
      const selected = currentPathname === link
      return (
        <Link className={classNames('my-2 mx-4 font-medium text-qrinavy', {
          'text-blush-600': selected
        })} key={i} to={link}>
          <div className='flex items-center'>
            <Icon className='mr-2' size='md' icon={icon} />
            <span style={{ fontSize: '16px' }}>{text}</span>
          </div>
        </Link>
      )
    })}
  </div>
)

export default ButtonGroup
