import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import ExternalLink from './ExternalLink'

interface TextLinkProps {
  to?: string
  // appends arbitrary classnames to the rendered element
  className?: string
  // overrides the default color and hover color
  colorClassName?: string
  onClick?: () => void
}

const defaultColorClassname = 'text-qriblue hover:text-qriblue-800'

const TextLink: React.FC<TextLinkProps> = ({
  to='',
  onClick,
  className='',
  colorClassName = defaultColorClassname,
  children
}) => {

  const combinedClassNames = classNames('hover:cursor-pointer transition-all duration-100', colorClassName, className)

  if (to) {
    if (to.indexOf('http') === 0) {
      return <ExternalLink to={to} className={combinedClassNames}>{children}</ExternalLink>
    } else {
      return <Link to={to} className={combinedClassNames}>{children}</Link>
    }
  }

  return (
    <span className={combinedClassNames} onClick={onClick}>
      {children}
    </span>
  )
}

export default TextLink
