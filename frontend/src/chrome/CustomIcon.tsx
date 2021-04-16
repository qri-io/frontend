import React from 'react'
import classNames from 'classnames'

// TODO(chriswhong): add size prop for sizes other than 24x24
export interface CustomIconProps {
  className?: string
}

const CustomIcon: React.FunctionComponent<CustomIconProps> = ({
  className,
  children
}) => {
  return (
    <svg className={classNames(className, 'svg-inline--fa', `fa-lg`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  )
}

export default CustomIcon
