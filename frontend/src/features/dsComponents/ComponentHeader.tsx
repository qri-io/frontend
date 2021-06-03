import React from 'react'

const ComponentHeader: React.FC<{}> = ({ children }) => {
  return (
    <div className='flex-grow text-sm px-8 py-3 border-b'>
      {children}
    </div>
  )
}

export default ComponentHeader
