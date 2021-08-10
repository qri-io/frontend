import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'

interface ContentBoxProps {
  className?: string
  paddingClassName?: string
  // if warning exists, the contentbox will have a yellow warning section below the primary content
  warning?: string
}

const ContentBox: React.FC<ContentBoxProps> = ({
  className,
  paddingClassName = 'py-6 px-8',
  warning,
  children
}) => (
  <div className={className}>
    <div className={classNames('min-height-200 max-h-full bg-white', paddingClassName, {
      'rounded-lg': !warning,
      'rounded-t-lg': warning
    })}>
      {children}
    </div>
    { warning && (
      <div className='relative'>
        <div className='rounded-xl absolute bg-white inline-block flex items-center justify-center' style={{
          top: -8,
          left: 10,
          height: 18,
          width: 18
        }}>
          <div className='text-warningyellow'><Icon icon='circleWarning' size='2xs' /></div>
        </div>
        <div className={'output px-5 py-2 rounded-sm border-2 rounded-b-lg border-warningyellow bg-white text-qrigray-400 text-xs'}>
          {warning}
        </div>
      </div>
    )}
  </div>
)

export default ContentBox
