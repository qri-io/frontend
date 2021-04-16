import React from 'react'

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import {
  faArchive,
  faArrowLeft,
  faArrowRight,
  faBars,
  faBolt,
  faCaretDown,
  faCheckCircle,
  faCircle,
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

import ActivityFeed from './icon/ActivityFeed'
import CaretLeft from './icon/CaretLeft'
import CaretRight from './icon/CaretRight'
import Clock from './icon/Clock'
import Code from './icon/Code'
import Commit from './icon/Commit'
import Dashboard from './icon/Dashboard'
import Eye from './icon/Eye'
import History from './icon/History'
import MyDatasets from './icon/MyDatasets'
import SkinnySearch from './icon/SkinnySearch'

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

const faIcons: Record<string, IconDefinition> = {
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
  'close': faCheck, // TODO (b5) - close icon def
  'cloudUpload': faCloudUploadAlt,
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

const Icon: React.FunctionComponent<IconProps> = ({
  icon = 'unknown',
  size = 'md',
  className,
  rotation,
  spin
}) => {

  const faIconsList = Object.keys(faIcons)

  const customIcons: {[key: string]: any} = {
    activityFeed: <ActivityFeed className={className} />,
    caretLeft: <CaretLeft className={className} />,
    caretRight: <CaretRight className={className} />,
    clock: <Clock className={className} />,
    code: <Code className={className} />,
    commit: <Commit className={className} />,
    dashboard: <Dashboard className={className} />,
    eye: <Eye className={className} />,
    history: <History className={className} />,
    myDatasets: <MyDatasets className={className} />,
    skinnySearch: <SkinnySearch className={className} />
  }

  if (faIconsList.includes(icon)) {
    return <FontAwesomeIcon rotation={rotation} size={sizes[size]} icon={faIcons[icon]} className={className} spin={spin} />
  }

  return customIcons[icon]
}

export default Icon
