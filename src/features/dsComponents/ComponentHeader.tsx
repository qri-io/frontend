import React from 'react'
import classNames from 'classnames'

interface ComponentHeaderProps {
  border?: boolean
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({ border = true, children }) => {
  return (
    <div className={classNames('text-sm py-3', {
      'border-b': border
    })}>
      {children}
    </div>
  )
}

export default ComponentHeader
