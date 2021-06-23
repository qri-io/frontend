import React from 'react'
import classNames from 'classnames'

interface ComponentHeaderProps {
  border?: boolean
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({ border = true, children }) => {
  return (
    <div className={classNames('flex-grow text-sm py-3 px-4', {
      'border-b': border
    })}>
      {children}
    </div>
  )
}

export default ComponentHeader
