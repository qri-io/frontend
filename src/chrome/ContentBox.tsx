import React from 'react'
import classNames from 'classnames'

interface ContentBoxProps {
  className?: string
  paddingClassName?: string
}

const ContentBox: React.FC<ContentBoxProps> = ({
  className,
  paddingClassName = 'py-6 px-8',
  children
}) => (
  <div className={classNames('min-height-200 rounded-lg bg-white', className, paddingClassName)}>
    {children}
  </div>
)

export default ContentBox
