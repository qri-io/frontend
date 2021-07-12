import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames'

import Icon from './Icon'
import DropdownMenuItem, { DropdownMenuItemProps } from './DropdownMenuItem';

interface DropdownMenuProps {
  alignLeft?: boolean
  className?: string
  icon?: string | React.ReactElement
  items: DropdownMenuItemProps[]
}

// DropdownMenu shows menu when a given "icon" prop is clicked. the element to 
// be clicked must be passed in as the "icon" prop. pass contents of the menu as
// children
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  icon,
  alignLeft=false,
  className='',
  items
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
        {(typeof icon === 'string') ? <Icon icon={icon} /> : icon}
      </div>
      {open && (
        <div
          className={classNames(`origin-top-right absolute top-8 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30`, { 'left-0': alignLeft, 'right-0': !alignLeft })}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          style={{ minWidth: '9rem' }}
        >
          <div className="py-1 flex flex-col" onClick={ () => setOpen(false) }>
            {items.map((props, i) => <DropdownMenuItem key={i} {...props} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
