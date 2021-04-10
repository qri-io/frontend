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
  'check': faCheck,
  'checkCircle': faCheckCircle,
  'circle': faCircle,
  'clock': faClock,
  'close': faCheck, // TODO (b5) - close icon def
  'cloudUpload': faCloudUploadAlt,
  'code': faCode,
  'ellipsisH': faEllipsisH,
  'envelope': faEnvelope,
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

  if (icon === 'dashboard') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5001 6.83336H4.50001C3.67158 6.83336 3 6.16178 3 5.33335V4.50001C3 3.67158 3.67158 3 4.50001 3H19.5001C20.3285 3 21.0001 3.67158 21.0001 4.50001V5.33335C21.0001 6.16178 20.3285 6.83336 19.5001 6.83336Z" stroke="currentColor" stroke-width="2"/>
        <path d="M6.16687 21H4.50019C3.67176 21 3.00018 20.3284 3.00018 19.5V11.9999C3.00018 11.1715 3.67176 10.4999 4.50019 10.4999H6.16687C6.9953 10.4999 7.66688 11.1715 7.66688 11.9999V19.5C7.66688 20.3284 6.9953 21 6.16687 21Z" stroke="currentColor" stroke-width="2"/>
        <path d="M19.5009 21H12.8342C12.0057 21 11.3342 20.3284 11.3342 19.5V11.9999C11.3342 11.1715 12.0057 10.4999 12.8342 10.4999H19.5009C20.3293 10.4999 21.0009 11.1715 21.0009 11.9999V19.5C21.0009 20.3284 20.3293 21 19.5009 21Z" stroke="currentColor" stroke-width="2"/>
      </svg>
    )
  }

  if (icon === 'mydatasets') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.81818 8.63636C2.81403 8.63636 2 7.82234 2 6.81818C2 5.81403 2.81403 5 3.81818 5C4.82234 5 5.63636 5.81403 5.63636 6.81818C5.63636 7.30039 5.4448 7.76286 5.10383 8.10383C4.76285 8.44481 4.30039 8.63636 3.81818 8.63636Z" fill="currentColor"/>
        <path d="M21.091 7.72718H8.36368C7.8616 7.72718 7.45459 7.32016 7.45459 6.81809C7.45459 6.31601 7.8616 5.909 8.36368 5.909H21.091C21.593 5.909 22 6.31601 22 6.81809C22 7.32016 21.593 7.72718 21.091 7.72718Z" fill="currentColor"/>
        <path d="M3.81818 14.091C2.81403 14.091 2 13.2769 2 12.2728C2 11.2686 2.81403 10.4546 3.81818 10.4546C4.82234 10.4546 5.63636 11.2686 5.63636 12.2728C5.63636 13.2769 4.82234 14.091 3.81818 14.091Z" fill="currentColor"/>
        <path d="M21.091 13.1817H8.36368C7.8616 13.1817 7.45459 12.7747 7.45459 12.2726C7.45459 11.7705 7.8616 11.3635 8.36368 11.3635H21.091C21.593 11.3635 22 11.7705 22 12.2726C22 12.7747 21.593 13.1817 21.091 13.1817Z" fill="currentColor"/>
        <path d="M3.81818 19.5454C2.81403 19.5454 2 18.7314 2 17.7272C2 16.7231 2.81403 15.9091 3.81818 15.9091C4.82234 15.9091 5.63636 16.7231 5.63636 17.7272C5.63636 18.7314 4.82234 19.5454 3.81818 19.5454Z" fill="currentColor"/>
        <path d="M21.091 18.6363H8.36368C7.8616 18.6363 7.45459 18.2293 7.45459 17.7272C7.45459 17.2251 7.8616 16.8181 8.36368 16.8181H21.091C21.593 16.8181 22 17.2251 22 17.7272C22 18.2293 21.593 18.6363 21.091 18.6363Z" fill="currentColor"/>
      </svg>
    )
  }

  if (icon === 'activityfeed') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.375 2H6.25L5 12.625H11.25L9.375 22L18.75 7.625H11.25L14.375 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
  }

  if (icon === 'skinnySearch') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.79147 18.6668C14.0946 18.6668 17.5829 14.9358 17.5829 10.3334C17.5829 5.73098 14.0946 2 9.79147 2C5.48836 2 2 5.73098 2 10.3334C2 14.9358 5.48836 18.6668 9.79147 18.6668Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20.6996 22L15.2975 16.2222" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
  }

  if (icon === 'eye') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12.1315" cy="12.3216" r="2.42105" stroke="currentColor" stroke-width="2"/>
        <path d="M2 12.3216C12.6579 0.347944 22 12.3216 22 12.3216C12 24.6901 2 12.3216 2 12.3216Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
  }

  if (icon === 'history') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10C2.89543 10 2 9.10457 2 8C2 6.89543 2.89543 6 4 6C5.10457 6 6 6.89543 6 8C6 8.53043 5.78929 9.03914 5.41421 9.41421C5.03914 9.78929 4.53043 10 4 10Z" stroke="currentColor" stroke-width="2"/>
        <path d="M4 18C2.89543 18 2 17.1046 2 16C2 14.8954 2.89543 14 4 14C5.10457 14 6 14.8954 6 16C6 17.1046 5.10457 18 4 18Z" stroke="currentColor" stroke-width="2"/>
        <rect x="9" y="6" width="13" height="4" rx="2" stroke="currentColor" stroke-width="2"/>
        <rect x="9" y="14" width="13" height="4" rx="2" stroke="currentColor" stroke-width="2"/>
        <path d="M4 2V6M4 22V18M4 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    )
  }

  if (icon === 'code') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5103 6.66669L22 11.25L17.5103 16.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.48975 6.66669L1.99995 11.25L6.48975 16.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.4286 5L10.1633 18.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
  }

  if (icon === 'clock') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
        <path d="M12 7V12.8333L14.5 15.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>

    )
  }

  if (icon === 'caretRight') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.09524 22L17 12L7.09524 2" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
  }

  if (icon === 'caretLeft') {
    return (
      <svg className={classNames(className, 'svg-inline--fa', `fa-${sizes[size]}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.9048 22L7 12L16.9048 2" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
  }

  return <FontAwesomeIcon rotation={rotation} size={sizes[size]} icon={icons[icon]} className={className} spin={spin} />
}

export default Icon
