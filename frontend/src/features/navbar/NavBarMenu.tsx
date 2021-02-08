import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../chrome/Icon'

export interface NavBarMenuItem {
  type: 'link' | 'hr'
  label: string
  to?: string
}

export interface NavBarMenuProps {
  items?: NavBarMenuItem[]
}

const NavBarMenu: React.FC<NavBarMenuProps> = ({ items = [] }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className='relative mr-5 ml-1'>
      <div className='text-white' onClick={() => { setOpen(!open) }}><Icon icon='bars' /></div>
      {open &&
        <div className='absolute bg-gray-600 p-5 z-20'>
          {items.map((item, i) => {
            switch (item.type) {
              case 'link':
                return <Link key={i} to={item.to || ''}>{item.label}</Link>
              case 'hr':
                return <hr key={i} />
              default:
                return <p>{JSON.stringify(item)}</p>
            }
          })}
        </div>
      }
    </div>
  )
}

export default NavBarMenu
