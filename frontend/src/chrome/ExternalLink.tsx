import React from 'react'

export interface ExternalLinkProps {
  id?: string
  to: string
  children: React.ReactNode
  className?: string
  tooltip?: string
}

export function openExternal (e: React.MouseEvent, href: string) {}

export const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({
  id,
  to,
  children,
  className,
  tooltip
}) =>
  <a
    id={id}
    href={to}
    target='_blank'
    rel="noopener noreferrer"
    className={`text-blue-500 hover:text-blue-600 hover:cursor-pointer ${className}`}
    data-tip={tooltip}
  >
    {children}
  </a>

export default ExternalLink
