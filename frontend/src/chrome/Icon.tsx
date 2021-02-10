import React from 'react'
import classNames from 'classnames'

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import {
  faArchive,
  faArrowRight,
  faBars,
  faBolt,
  faCaretDown,
  faCaretRight,
  faCheckCircle,
  faCircle,
  faClock,
  faCloudUploadAlt,
  faCode,
  faGlasses,
  faProjectDiagram,
  faEnvelope,
  faFont,
  faHashtag,
  faHdd,
  faInfo,
  faList,
  faCheck,
  faPauseCircle,
  faPen,
  faPlayCircle,
  faPlus,
  faMinusCircle,
  faTags,
  faTimes,
  faTh,
  faToggleOn,
  faExclamationCircle,
  faExclamationTriangle,
  faQuestion,
  faQuestionCircle,
  faShip,
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
  className?: string
  rotation?: 90 | 180 | 270
  spin?: boolean
}

const icons: Record<string, IconDefinition> = {
  'any': faQuestion,
  'array': faQuestionCircle,
  'arrowRight': faArrowRight,
  'bars': faBars,
  'boolean': faToggleOn,
  'caretDown': faCaretDown,
  'caretRight': faCaretRight,
  'check': faCheck,
  'checkCircle': faCheckCircle,
  'circle': faCircle,
  'clock': faClock,
  'close': faCheck, // TODO (b5) - close icon def
  'code': faCode,
  'body': faArchive,
  'bolt': faBolt,
  'projectDiagram': faProjectDiagram,
  'cloudUpload': faCloudUploadAlt,
  'envelope': faEnvelope,
  'file': faFile,
  'hdd': faHdd,
  'info': faInfo,
  'integer': faHashtag,
  'list': faList,
  'pauseCircle': faPauseCircle,
  'playCircle': faPlayCircle,
  'minusCircle': faMinusCircle,
  'meta': faTags,
  'null': faQuestionCircle,
  'number': faHashtag,
  'numeric': faHashtag,
  'object': faQuestionCircle,
  'pen': faPen,
  'plus': faPlus,
  'readme': faGlasses,
  'ship': faShip,
  'sortDown': faSortDown,
  'string': faFont,
  'structure': faTh,
  'times': faTimes,
  'transform': faCode,
  'unknown': faQuestionCircle,
  'exclamationCircle': faExclamationCircle,
  'exclamationTriangle': faExclamationTriangle,
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
  className,
  rotation,
  spin
}) => {

  if (icon === 'commit') {
    return (
      <svg aria-hidden='true' focusable='false' className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 91'>
        <circle id='Oval' stroke='currentColor' strokeWidth='10' cx='26' cy='45' r='21' fill='none'></circle>
        <line x1='26.5' y1='4.5' x2='26.5' y2='22.5' id='Line' stroke='currentColor' strokeWidth='10' strokeLinecap='square'></line>
        <line x1='26.5' y1='66.5' x2='26.5' y2='86.5' id='Line' stroke='currentColor' strokeWidth='10' strokeLinecap='square'></line>
      </svg>
    )
  }

  return <FontAwesomeIcon rotation={rotation} size={sizes[size]} icon={icons[icon]} className={className} spin={spin} />
}

export default Icon
