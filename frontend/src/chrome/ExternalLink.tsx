import React from 'react'

export interface ExternalLinkProps {
  id?: string
  to: string
  children: React.ReactNode
  // providing className prop will override the component's color classes
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
    className={`${className || 'text-qriblue hover:text-qriblue-600'} hover:cursor-pointer`}
    data-tip={tooltip}
  >
    {children}
  </a>

export default ExternalLink
