import React from 'react'
import classNames from 'classnames'

export interface BlockProps {
  name?: string
  onClick?: () => void
}

const Block: React.FC<BlockProps> = ({ name, onClick, children }) => (
  <div className='px-2 w-full py-2 h-28' onClick={onClick}>
    <div className={classNames('px-3 py-2 rounded-md h-full border-qrigray-200 border', {
      'cursor-pointer': !!onClick
    })}>
      { name && <div className='text-sm font-semibold pb-1 text-qrigray-300'>{name}</div>}
      {children}
    </div>
  </div>
)

export default Block
