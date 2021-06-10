import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import ExternalLink from './ExternalLink'
import Icon from './Icon'

export interface DropDownMenuItem {
  // link is the url string that clicking this item can send the user
  // link overrides `onClick`, ie if you have both link and onClick set, only
  // the link will work
  link?: string
  active: boolean
  text: string
  disabled?: boolean
  // icon: options are found in the `Icon` component
  icon?: string
  onClick?: (e?: React.MouseEvent) => void

}

interface DropdownMenuProps {
  items: DropDownMenuItem[]
  alignLeft?: boolean
  className?: string
}

// itemProps will be passed into the onClick handler for each item in the dropdown
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  items,
  alignLeft=false,
  className=''
}) => {
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
    <div ref={ref} className={classNames('relative inline-block text-left', className)}>
      <div onClick={() => { setOpen(!open) }} className='cursor-pointer flex items-center'>
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
          <div className="py-1 flex flex-col" onClick={ () => setOpen(false) }>
            {items && items.map(({ link, active, onClick, text, icon='', disabled=false }, i) => {
              let linkButtonClass = 'text-left text-xs px-2 py-0.5 mx-2 my-1 whitespace-nowrap rounded-md'
              if (!disabled) {
                linkButtonClass = `${linkButtonClass} hover:pointer text-qrigray-400 hover:bg-gray-100`
              } else {
                linkButtonClass = `${linkButtonClass} text-gray-400`
              }

              const content = <span className={classNames({ 'text-qripink font-semibold': active })}>{icon && <Icon icon={icon} className='mr-2' size='sm' />}{text}</span>

              if (link) {
                if (link.startsWith('http')) {
                  return (
                    <ExternalLink to={link} key={i} className={linkButtonClass}>
                      <button  role="menuitem">
                        {content}
                      </button>
                    </ExternalLink>
                  )
                }

                return (
                  <Link to={link} key={i} className={linkButtonClass}>
                    <button role="menuitem">
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
