import React, { useState } from 'react';
import { Link } from 'react-router-dom'

import Icon from './Icon'

export interface DropDownMenuItem {
  link?: string
  onClick?: (context: any) => void
  text: string
  disabled?: boolean
  icon?: string
}

interface DropdownMenuProps {
  items: DropDownMenuItem[]
  itemProps?: any
  alignLeft?: boolean
}

// itemProps will be passed into the onClick handler for each item in the dropdown
const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, items, itemProps, alignLeft=false }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className='relative inline-block text-left'>
      <div onClick={() => { setOpen(!open) }} className='cursor-pointer'>
        {children}
      </div>
      {open && (
        <div
          className={`origin-top-right absolute top-8 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 ${alignLeft ? 'left-0' : 'right-0'}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          style={{ minWidth: '9rem' }}
        >
          <div className="py-1" onClick={ () => setOpen(false) }>
            {items && items.map(({ link, onClick, text, icon='', disabled=false }, i) => {
              let linkButtonClass = 'w-full block text-left px-4 py-2 text-sm whitespace-nowrap overflow-hidden'
              if (!disabled) {
                linkButtonClass = `${linkButtonClass} hover:pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900`
              } else {
                linkButtonClass = `${linkButtonClass} text-gray-400`
              }

              const content = <span>{icon && <Icon icon={icon} className='mr-2' />}{text}</span>

              if (link) {
                return (
                  <Link to={link} key={i}>
                    <button
                      className={linkButtonClass}
                      role="menuitem"
                    >
                      {content}
                    </button>
                  </Link>
                )
              }

              if (onClick) {
                return (
                  <button
                    onClick={() => { onClick(itemProps) }}
                    className={linkButtonClass}
                    role="menuitem"
                    key={i}
                  >
                    {content}
                  </button>
                )
              }
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
