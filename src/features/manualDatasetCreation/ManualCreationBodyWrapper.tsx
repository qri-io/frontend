import React from "react"

interface ManualCreationBodyWrapperProps {
  className?: string
}

const ManualCreationBodyWrapper: React.FC<ManualCreationBodyWrapperProps> = ({
  className,
  children
}) => (
  <div className={className} style={{ height: 'calc(100vh - 340px)' }}>
    {children}
  </div>
)

export default ManualCreationBodyWrapper
