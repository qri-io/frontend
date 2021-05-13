import React from 'react'

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faBars,
  faBolt,
  faCaretDown,
  faCheckCircle,
  faCircle,
  faCloudUploadAlt,
  faCode,
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
  faPlayCircle,
  faPlay,
  faPlus,
  faPlusCircle,
  faPauseCircle,
  faTimes,
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
import AutomationFilled from './icon/AutomationFilled'
import Body from './icon/Body'
import Brackets from './icon/Brackets'
import CaretLeft from './icon/CaretLeft'
import CaretRight from './icon/CaretRight'
import Clock from './icon/Clock'
import Code from './icon/Code'
import Commit from './icon/Commit'
import Dashboard from './icon/Dashboard'
import Disk from './icon/Disk'
import Download from './icon/Download'
import EllipsesVertical from './icon/EllipsesVertical'
import Eye from './icon/Eye'
import Follower from './icon/Follower'
import Globe from './icon/Globe'
import History from './icon/History'
import Lock from './icon/Lock'
import MyDatasets from './icon/MyDatasets'
import Readme from './icon/Readme'
import SkinnySearch from './icon/SkinnySearch'
import Structure from './icon/Structure'
import Tags from './icon/Tags'



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

export type IconSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg'

const faIcons: Record<string, IconDefinition> = {
  'any': faQuestion,
  'array': faQuestionCircle,
  'arrowLeft': faArrowLeft,
  'arrowRight': faArrowRight,
  'bars': faBars,
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
  'search': faSearch,
  'ship': faShip,
  'sortDown': faSortDown,
  'spinner': faSpinner,
  'string': faFont,
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
    activityFeed: <ActivityFeed className={className} size={size} />,
    automationFilled: <AutomationFilled className={className} size={size} />,
    body: <Body className={className} size={size} />,
    brackets: <Brackets className={className} size={size} />,
    caretLeft: <CaretLeft className={className} size={size} />,
    caretRight: <CaretRight className={className} size={size} />,
    clock: <Clock className={className} size={size} />,
    code: <Code className={className} size={size} />,
    commit: <Commit className={className} size={size} />,
    dashboard: <Dashboard className={className} size={size} />,
    disk: <Disk className={className} size={size} />,
    download: <Download className={className} size={size} />,
    ellipsesVertical: <EllipsesVertical className={className} size={size} />,
    eye: <Eye className={className} size={size} />,
    follower: <Follower className={className} size={size} />,
    globe: <Globe className={className} size={size} />,
    history: <History className={className} size={size} />,
    lock: <Lock className={className} size={size} />,
    myDatasets: <MyDatasets className={className} size={size} />,
    readme: <Readme className={className} size={size} />,
    skinnySearch: <SkinnySearch className={className} size={size} />,
    structure: <Structure className={className} size={size} />,
    tags: <Tags className={className} size={size} />
  }

  if (faIconsList.includes(icon)) {
    return <FontAwesomeIcon rotation={rotation} size={sizes[size]} icon={faIcons[icon]} className={className} spin={spin} />
  }

  return customIcons[icon]
}

export default Icon
