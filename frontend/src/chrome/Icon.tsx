import React from 'react'
import classNames from 'classnames'

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import {
  faArchive,
  faArrowLeft,
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
  faEllipsisH,
  faEnvelope,
  faFont,
  faHashtag,
  faHome,
  faHdd,
  faInfo,
  faList,
  faCheck,
  faPen,
  faMinusCircle,
  faTags,
  faPlayCircle,
  faPlay,
  faPlus,
  faPlusCircle,
  faPauseCircle,
  faTimes,
  faTh,
  faToggleOn,
  faExclamationCircle,
  faExclamationTriangle,
  faQuestion,
  faQuestionCircle,
  faSearch,
  faShip,
  faSortDown,
  faSpinner,
  faTable,

  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

import {
  faEye,
  faFile
} from '@fortawesome/free-regular-svg-icons'


interface IconProps {
  // name of the icon
  icon: string
  // size sm: .875em
  // md: 1.33em
  // lg: 2em
  size?: IconSize
  className?: string
  rotation?: 90 | 180 | 270
  spin?: boolean
}

export type IconSize = 'xs' | 'sm' | 'md' | 'lg'

const icons: Record<string, IconDefinition> = {
  'any': faQuestion,
  'array': faQuestionCircle,
  'arrowLeft': faArrowLeft,
  'arrowRight': faArrowRight,
  'bars': faBars,
  'body': faArchive,
  'bolt': faBolt,
  'boolean': faToggleOn,
  'caretDown': faCaretDown,
  'caretRight': faCaretRight,
  'check': faCheck,
  'checkCircle': faCheckCircle,
  'circle': faCircle,
  'clock': faClock,
  'close': faCheck, // TODO (b5) - close icon def
  'cloudUpload': faCloudUploadAlt,
  'code': faCode,
  'ellipsisH': faEllipsisH,
  'envelope': faEnvelope,
  'eye': faEye,
  'exclamationCircle': faExclamationCircle,
  'exclamationTriangle': faExclamationTriangle,
  'file': faFile,
  'hdd': faHdd,
  'home': faHome,
  'info': faInfo,
  'integer': faHashtag,
  'list': faList,
  'meta': faTags,
  'minusCircle': faMinusCircle,
  'null': faQuestionCircle,
  'number': faHashtag,
  'numeric': faHashtag,
  'object': faQuestionCircle,
  'pauseCircle': faPauseCircle,
  'pen': faPen,
  'play': faPlay,
  'playCircle': faPlayCircle,
  'plus': faPlus,
  'plusCircle': faPlusCircle,
  'projectDiagram': faProjectDiagram,
  'readme': faGlasses,
  'search': faSearch,
  'ship': faShip,
  'sortDown': faSortDown,
  'spinner': faSpinner,
  'string': faFont,
  'structure': faTh,
  'table': faTable,
  'times': faTimes,
  'transform': faCode,
  'unknown': faQuestionCircle,
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
