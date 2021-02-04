import React, { useState } from 'react';

interface DropDownMenuItem {
  onClick: () => void;
  text: string;
}

interface DropdownMenuProps {
  items?: DropDownMenuItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, items }) => {

  const [open, setOpen] = useState(false)

  const linkButtonClass = 'hover:pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'

  return (
    <div className='relative inline-block text-left'>
      <div onClick={() => { setOpen(!open) }} className='cursor-pointer'>
        {children}
      </div>
      {open && (
        <div className="origin-top-right absolute right-0 top-8 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <div className="py-1" onClick={ () => setOpen(false) }>
            {items && items.map(({ onClick, text }) => (
              <button
                onClick={onClick}
                className={linkButtonClass}
                role="menuitem"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
