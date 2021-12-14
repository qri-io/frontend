import React from "react"
import classNames from 'classnames'

interface DatasetEditorBodyWrapperProps {
  className?: string
}

const DatasetEditorBodyWrapper: React.FC<DatasetEditorBodyWrapperProps> = ({
  className,
  children
}) => (
  <div className={classNames(className, 'h-full')} >
    {children}
  </div>
)

export default DatasetEditorBodyWrapper
