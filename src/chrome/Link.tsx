import React from 'react'
import classNames from 'classnames'
import { Link as RouterLink } from 'react-router-dom'

interface LinkProps {
  to?: string
  className?: string,
  colorClassName?: string,
  onClick?: () => void
}

const Link: React.FC<LinkProps> = ({
  to,
  className,
  colorClassName = 'text-qriblue hover:text-qriblue-800',
  onClick,
  children
}) => {
  const combinedClassNames = classNames('cursor-pointer transition-all duration-100', colorClassName)

  // use a <div> by default
  let theLink = (
    <span onClick={onClick} className={combinedClassNames}>
      {children}
    </span>
  )

  // if to exists, make it a react-router-dom <Link>
  if (to) {
    theLink = (
      <RouterLink to={to} className={combinedClassNames}>
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
    <span className={className}>
      {theLink}
    </span>
  )
}

export default Link