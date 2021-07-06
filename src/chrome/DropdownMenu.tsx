// DropdownMenu can be used a controlled input to choose from multiple values (e.g. choosing trigger options)
// or as a list of links/function triggers (e.g. the user menu)
// DropdownMenu only renders the list of options on click, the element to be clicked must be passed in as a child

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import ExternalLink from './ExternalLink'
import Icon from './Icon'

export interface DropDownMenuItem {
  // label is the text that will be displayed to the user
  label: string
  // disabled will show the item, but it will not be clickable
  disabled?: boolean
  // icon: options are found in the `Icon` component
  icon?: string
  // value will be passed to the onChange function
  value?: string
  // if link exists in a DropDownMenuItem, clicking the item will not trigger onChange,
  // and will navigate to the link
  link?: string
  // if onClick exists in a DropDownMenuItem, clicking the item will not trigger onChange,
  // and will execute the onClick function
  onClick?: () => void
}

interface DropdownMenuProps {
  // the value of the selected menu item, which will be shown as highlighted
  selectedValue?: string
  items: DropDownMenuItem[]
  alignLeft?: boolean
  className?: string
  onChange?: (value: string) => void
}

// itemProps will be passed into the onClick handler for each item in the dropdown
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  selectedValue,
  items,
  alignLeft=false,
  className='',
  onChange=() => {},
  children
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
    <div ref={ref} className={classNames('relative inline-block text-left w-full', className)}>
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
            {items && items.map(({
              link,
              value,
              onClick,
              label,
              icon = '',
              disabled = false
            }, i) => {

              const menuItemClassName = classNames('text-left text-xs px-2 py-0.5 mx-2 my-1 whitespace-nowrap rounded-md', {
                'hover:pointer text-qrigray-400 hover:bg-gray-100': !disabled,
                'text-qrigray-300': disabled
              })

              const content = <span className={classNames({ 'text-qripink font-semibold': selectedValue && (selectedValue === value) })}>{icon && <Icon icon={icon} className='mr-2' size='sm' />}{label}</span>

              if (link) {
                if (link.startsWith('http')) {
                  return (
                    <ExternalLink to={link} key={i} className={menuItemClassName}>
                      <button  role="menuitem">
                        {content}
                      </button>
                    </ExternalLink>
                  )
                }

                return (
                  <Link to={link} key={i} className={menuItemClassName}>
                    <button role="menuitem">
                      {content}
                    </button>
                  </Link>
                )
              }

              const handleItemClick = () => {
                if (onClick) {
                  onClick()
                }

                if (onChange && value) {
                  onChange(value)
                }
              }

              return (
                <button
                  onClick={handleItemClick}
                  className={menuItemClassName}
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
