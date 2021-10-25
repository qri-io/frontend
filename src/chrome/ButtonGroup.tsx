import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Icon from './Icon'
import { trackGoal } from '../features/analytics/analytics'

export interface ButtonGroupProps {
  items: ButtonGroupItem[]
  selectedIndex?: number
}

export interface ButtonGroupItem {
  text: string
  icon: string
  link: string
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  items,
  selectedIndex = -1
}) => (
  <div className='m-1 flex'>
    {items.map(({ text, icon, link }, i) => {
      const selected = selectedIndex === i
      return (
        <Link
          className={classNames('my-2 mx-4 font-medium text-black transition-100 transition-all hover:text-qripink', {
            'text-qripink': selected
          })}
          key={i}
          to={link}
          onClick={text === 'My Datasets'
            ? () => {
              // general-click-my-datasets event
              trackGoal('LKV9RUBF', 0)
            }
            : () => {}
          }
        >
          <div className='flex items-center'>
            <Icon className='mr-2' size='md' icon={icon} />
            <span className='font-bold text-sm'>{text}</span>
          </div>
        </Link>
      )
    })}
  </div>
)

export default ButtonGroup
