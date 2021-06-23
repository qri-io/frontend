import React from 'react'

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faBars,
  faBolt,
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
  faList,
  faCheck,
  faPen,
  faMinusCircle,
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
import CaretDown from './icon/CaretDown'
import Checkbox from './icon/Checkbox'
import CircleCheck from './icon/CircleCheck'
import CircleDash from './icon/CircleDash'
import CircleX from './icon/CircleX'
import Clock from './icon/Clock'
import Close from './icon/Close'
import Code from './icon/Code'
import Columns from './icon/Columns'
import Commit from './icon/Commit'
import Dashboard from './icon/Dashboard'
import Discord from './icon/Discord'
import Disk from './icon/Disk'
import Download from './icon/Download'
import EllipsesVertical from './icon/EllipsesVertical'
import Eye from './icon/Eye'
import Follower from './icon/Follower'
import FullScreen from './icon/FullScreen'
import Github from './icon/Github'
import Globe from './icon/Globe'
import History from './icon/History'
import Loader from './icon/Loader'
import Info from './icon/Info'
import Lock from './icon/Lock'
import MyDatasets from './icon/MyDatasets'
import Page from './icon/Page'
import PlayCircle from './icon/PlayCircle'
import Readme from './icon/Readme'
import Rows from './icon/Rows'
import SkinnySearch from './icon/SkinnySearch'
import Structure from './icon/Structure'
import Tags from './icon/Tags'
import Twitter from './icon/Twitter'
import Youtube from './icon/Youtube'

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
  'check': faCheck,
  'checkCircle': faCheckCircle,
  'circle': faCircle,
  'cloudUpload': faCloudUploadAlt,
  'ellipsisH': faEllipsisH,
  'envelope': faEnvelope,
  'exclamationCircle': faExclamationCircle,
  'exclamationTriangle': faExclamationTriangle,
  'file': faFile,
  'hdd': faHdd,
  'home': faHome,
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
    caretDown: <CaretDown className={className} size={size} />,
    checkbox: <Checkbox className={className} size={size} />,
    circleCheck: <CircleCheck className={className} size={size} />,
    circleDash: <CircleDash className={className} size={size} />,
    circleX: <CircleX className={className} size={size} />,
    clock: <Clock className={className} size={size} />,
    close: <Close className={className} size={size} />,
    code: <Code className={className} size={size} />,
    columns: <Columns className={className} size={size} />,
    commit: <Commit className={className} size={size} />,
    dashboard: <Dashboard className={className} size={size} />,
    discord: <Discord className={className} size={size} />,
    disk: <Disk className={className} size={size} />,
    download: <Download className={className} size={size} />,
    ellipsesVertical: <EllipsesVertical className={className} size={size} />,
    eye: <Eye className={className} size={size} />,
    follower: <Follower className={className} size={size} />,
    fullScreen: <FullScreen className={className} size={size} />,
    github: <Github className={className} size={size} />,
    globe: <Globe className={className} size={size} />,
    history: <History className={className} size={size} />,
    info: <Info className={className} size={size} />,
    loader: <Loader className={className} size={size} />,
    lock: <Lock className={className} size={size} />,
    myDatasets: <MyDatasets className={className} size={size} />,
    page: <Page className={className} size={size} />,
    playCircle: <PlayCircle className={className} size={size} />,
    readme: <Readme className={className} size={size} />,
    rows: <Rows className={className} size={size} />,
    skinnySearch: <SkinnySearch className={className} size={size} />,
    structure: <Structure className={className} size={size} />,
    tags: <Tags className={className} size={size} />,
    twitter: <Twitter className={className} size={size} />,
    youtube: <Youtube className={className} size={size} />
  }

  if (faIconsList.includes(icon)) {
    return <FontAwesomeIcon rotation={rotation} size={sizes[size]} icon={faIcons[icon]} className={className} spin={spin} />
  }

  return customIcons[icon] || '?'
}

export default Icon
