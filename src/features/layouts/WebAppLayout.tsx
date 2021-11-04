import React from 'react'

const WebAppLayout: React.FC<{}> = ({ children }) => (
  <div className='web-app-layout h-full w-full' style={{ minWidth: '1100px' }}>
    { children }
  </div>
)

export default WebAppLayout
