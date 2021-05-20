import React from 'react'
import classNames from 'classnames'

interface ContentBoxProps {
  className?: string
}

const ContentBox: React.FC<ContentBoxProps> = ({
  className,
  children
}) => (
  <div className={classNames('min-height-200 py-6 px-8 rounded-lg bg-white', className)}>
    {children}
  </div>
)

export default ContentBox
