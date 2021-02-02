import React from 'react'
import classNames from 'classnames'

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faBars,
  faBolt,
  faCircle,
  faClock,
  faCloudUploadAlt,
  faCode,
  faProjectDiagram,
  faEnvelope,
  faHdd,
  faList,
  faCheck,
  faPlus,
  faTimes,
  faExclamationCircle,
  faSortDown,
  faSpinner,
  faTable,

  IconDefinition
} from '@fortawesome/free-solid-svg-icons'

import {
  faFile
} from '@fortawesome/free-regular-svg-icons'


interface IconProps {
  // name of the icon
  icon: string
  // size sm: .875em
  // md: 1.33em
  // lg: 2em
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'light' | 'medium' | 'dark' | 'red' | 'green'
  className?: string
  rotation?: 90 | 180 | 270
  spin?: boolean
}

const icons: Record<string, IconDefinition> = {
  'arrowRight': faArrowRight,
  'bars': faBars,
  'circle': faCircle,
  'clock': faClock,
  'code': faCode,
  'bolt': faBolt,
  'projectDiagram': faProjectDiagram,
  'cloudUpload': faCloudUploadAlt,
  'envelope': faEnvelope,
  'file': faFile,
  'hdd': faHdd,
  'list': faList,
  'check': faCheck,
  'close': faCheck, // TODO (b5) - close icon def
  'plus': faPlus,
  'sortDown': faSortDown,
  'times': faTimes,
  'exclamationCircle': faExclamationCircle,
  'spinner': faSpinner,
  'table': faTable,
}

const sizes: {[key: string]: FontAwesomeIconProps['size']} = {
  'xs': 'xs',
  'sm': 'sm',
  'md': 'lg',
  'lg': '2x'
}

export const iconsList = Object.keys(icons)

const Icon: React.FunctionComponent<IconProps> = ({
  icon = 'unknown',
  size = 'md',
  color = 'dark',
  className,
  rotation,
  spin
}) => {

  return <FontAwesomeIcon rotation={rotation} size={sizes[size]} icon={icons[icon]} className={classNames('icon', `icon-${color}`, className)} spin={spin} />
}

export default Icon
