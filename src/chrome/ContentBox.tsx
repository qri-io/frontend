import React from 'react'
import classNames from 'classnames'

interface ContentBoxProps {
  className?: string
  paddingClassName?: string
  card?: boolean
}

const ContentBox: React.FC<ContentBoxProps> = ({
  className,
  paddingClassName = 'p-6',
  card = false,
  children
}) => (
  <div className={className}>
    <div className={classNames('min-height-200 h-full bg-white rounded-2xl', paddingClassName)} style={{
      boxShadow: card ? '0px 0px 8px rgba(0, 0, 0, 0.1)' : ''
    }}>
      {children}
    </div>
  </div>
)

export default ContentBox
