import React from 'react'
import classNames from 'classnames'
import { Link as RouterLink } from 'react-router-dom'

interface LinkProps {
  to?: string
  className?: string
  colorClassName?: string
  onClick?: () => void
  id?: string
}

const Link: React.FC<LinkProps> = ({
  to,
  className,
  colorClassName = 'text-qritile hover:text-qritile-800',
  onClick,
  children,
  id
}) => {
  const combinedClassNames = classNames('cursor-pointer transition-all duration-100', colorClassName)

  // use a <div> by default
  let theLink = (
    <span id={id} onClick={onClick} className={combinedClassNames}>
      {children}
    </span>
  )

  // if to exists, make it a react-router-dom <Link>
  if (to) {
    theLink = (
      <RouterLink to={to} className={combinedClassNames} onClick={onClick}>
        {children}
      </RouterLink>
    )
  }

  // if to contains http:// or https:// make it an <a>
  if (to?.match(/^https?:\/\//)) {
    theLink = (
      <a
        href={to}
        target='_blank'
        rel="noopener noreferrer"
        className={combinedClassNames}
      >
        {children}
      </a>
    )
  }

  return (
    <span className={className} onClick={onClick}>
      {theLink}
    </span>
  )
}

export default Link
