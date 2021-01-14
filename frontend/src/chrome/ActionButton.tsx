import React from 'react'
import classNames from 'classnames'
// import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

export interface ActionButtonProps {
  id?: string
  tooltip?: string
  label?: string
  icon?: IconDefinition | React.ReactElement | false
  disabled?: boolean
  onClick?: (event: React.MouseEvent) => void
  size: 'sm' | 'md' // default is 'md'
}

const ActionButton: React.FC<ActionButtonProps> = ({
  id = '',
  icon,
  label,
  tooltip,
  disabled,
  onClick,
  size = 'md'
}) => (
  <div
    id={id}
    className={classNames('header-column', { disabled })}
    data-tip={tooltip}
    onClick={onClick}
  >
    {icon && (React.isValidElement(icon)
      ? (<div className='header-column-icon'>{icon}</div>)
      : <div className='header-column-icon'><FontAwesomeIcon icon={icon} size='lg'/></div>
    )}
    {label &&
      <div className='header-column-text'>
        <div className={classNames('label', { 'small': size === 'sm' })}>{label}</div>
      </div>
    }
  </div>
)

export default ActionButton
