import React from 'react'
import classNames from 'classnames'

export interface BlockProps {
  name?: string
  onClick?: () => void
}

const Block: React.FC<BlockProps> = ({ name, onClick, children }) => (
  <div className='px-2 w-full py-2' onClick={onClick}>
    <div className={classNames('bg-white px-3 py-2 shadow-even rounded-lg h-full', {
      'cursor-pointer': !!onClick
    })}>
      { name && <div className='text-sm font-semibold pb-1 text-black'>{name}</div>}
      {children}
    </div>
  </div>
)

export default Block
