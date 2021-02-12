import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'

import Icon from './Icon'

export interface DropDownMenuItem {
  // link is the url string that clicking this item can send the user
  // link overrides `onClick`, ie if you have both link and onClick set, only
  // the link will work
  link?: string
  onClick?: (e?: React.MouseEvent) => void
  text: string
  disabled?: boolean
  // icon: options are found in the `Icon` component
  icon?: string
}

interface DropdownMenuProps {
  items: DropDownMenuItem[]
  alignLeft?: boolean
}

// itemProps will be passed into the onClick handler for each item in the dropdown
const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, items, alignLeft=false }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref && ref.current?.contains(e.target as Element)) {
      return
    }
    setOpen(false)
  }, [ref, setOpen])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <div ref={ref} className='relative inline-block text-left'>
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

              return (
                <button
                  onClick={onClick}
                  className={linkButtonClass}
                  role="menuitem"
                  key={i}
                >
                  {content}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
