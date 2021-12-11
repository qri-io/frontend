import React from "react"
import classNames from 'classnames'

interface ManualCreationBodyWrapperProps {
  className?: string
}

const ManualCreationBodyWrapper: React.FC<ManualCreationBodyWrapperProps> = ({
  className,
  children
}) => (
  <div className={classNames(className, 'h-full')} >
    {children}
  </div>
)

export default ManualCreationBodyWrapper
