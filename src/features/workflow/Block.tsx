import React from 'react'

export interface BlockProps {
  name?: string
  onClick?: () => void
}

const Block: React.FC<BlockProps> = ({ name, children,onClick }) => (
  <div className='px-2 w-full py-2' onClick={onClick}>
    <div className='bg-white px-3 py-2 shadow-even cursor-pointer rounded-lg h-full'>
      { name && <div className='text-sm font-semibold pb-1 text-qrinavy'>{name}</div>}
      {children}
    </div>
  </div>
)

export default Block
