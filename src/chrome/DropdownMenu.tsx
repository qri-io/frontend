import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames'

import Icon from './Icon'
import DropdownMenuItem, { DropdownMenuItemProps } from './DropdownMenuItem';

interface DropdownMenuProps {
  alignLeft?: boolean
  className?: string
  icon?: string | React.ReactElement
  items: DropdownMenuItemProps[]
  dropUp?: boolean
  oneItem?: boolean
}

// DropdownMenu shows menu when a given "icon" prop is clicked. the element to
// be clicked must be passed in as the "icon" prop. pass contents of the menu as
// children
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  icon,
  alignLeft=false,
  className='',
  items,
  dropUp=false,
  oneItem=false
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
      <div
        className={classNames(`transition-all duration-100 transform origin-top-right absolute rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40`,
          {
            'left-0': alignLeft,
            'right-0': !alignLeft,
            'origin-top-right top-8': !dropUp,
            'origin-bottom-right bottom-8': dropUp,
            'opacity-0 invisible -translate-y-2 scale-95': !open,
            'opacity-100 translate-y-0 scale-100 visible': open
          }
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
        style={oneItem ? { minWidth: '9rem', top: -8, right: 30 } : { minWidth: '9rem' }}
      >
        <div className="py-1 flex flex-col" onClick={ () => setOpen(false) }>
          {items.map((props, i) => <DropdownMenuItem key={i} {...props} />)}
        </div>
      </div>
    </div>
  )
}

export default DropdownMenu
