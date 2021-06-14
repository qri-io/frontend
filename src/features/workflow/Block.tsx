import React from 'react'

export interface BlockProps {
  name: string
  description: string
  onClick?: () => void
}

const Block: React.FC<any> = ({ name, description, onClick }) => (
  <div className='my-2 px-2' onClick={onClick}>
    <div className='bg-gray-100 px-4 py-2 rounded mt-1 border-b border-gray-300 cursor-pointer hover:bg-gray-100'>
      <div className='font-semibold pb-1'>{name}</div>
      <div className='text-xs'>{description}</div>
    </div>
  </div>
)

export default Block;
