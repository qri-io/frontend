import React from 'react'

import ActivityFeed from './icon/ActivityFeed'
import Any from './icon/Any'
import Array from './icon/Array'
import AutomationFilled from './icon/AutomationFilled'
import Body from './icon/Body'
import Boolean from './icon/Boolean'
import Brackets from './icon/Brackets'
import Calendar from './icon/Calendar'
import CaretLeft from './icon/CaretLeft'
import CaretRight from './icon/CaretRight'
import CaretDown from './icon/CaretDown'
import Checkbox from './icon/Checkbox'
import CheckboxChecked from './icon/CheckboxChecked'
import CircleCheck from './icon/CircleCheck'
import CircleDash from './icon/CircleDash'
import CircleWarning from './icon/CircleWarning'
import CircleX from './icon/CircleX'
import Clock from './icon/Clock'
import Close from './icon/Close'
import Code from './icon/Code'
import Columns from './icon/Columns'
import Commit from './icon/Commit'
import Dashboard from './icon/Dashboard'
import DeployCircle from './icon/DeployCircle'
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
import Integer from './icon/Integer'
import Lock from './icon/Lock'
import More from './icon/More'
import MyDatasets from './icon/MyDatasets'
import Null from './icon/Null'
import Number from './icon/Number'
import Object from './icon/Object'
import Page from './icon/Page'
import Play from './icon/Play'
import PlayCircle from './icon/PlayCircle'
import Plus from './icon/Plus'
import Readme from './icon/Readme'
import Rocket from './icon/Rocket'
import Rows from './icon/Rows'
import SkinnySearch from './icon/SkinnySearch'
import String from './icon/String'
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

const Icon: React.FunctionComponent<IconProps> = ({
  icon = 'unknown',
  size = 'md',
  className,
  rotation,
  spin
}) => {

  const customIcons: {[key: string]: any} = {
    activityFeed: <ActivityFeed className={className} size={size} />,
    any: <Any className={className} size={size} />,
    array: <Array className={className} size={size} />,
    automationFilled: <AutomationFilled className={className} size={size} />,
    body: <Body className={className} size={size} />,
    boolean: <Boolean className={className} size={size} />,
    brackets: <Brackets className={className} size={size} />,
    calendar: <Calendar className={className} size={size} />,
    caretLeft: <CaretLeft className={className} size={size} />,
    caretRight: <CaretRight className={className} size={size} />,
    caretDown: <CaretDown className={className} size={size} />,
    checkbox: <Checkbox className={className} size={size} />,
    checkboxChecked: <CheckboxChecked className={className} size={size} />,
    circleCheck: <CircleCheck className={className} size={size} />,
    circleDash: <CircleDash className={className} size={size} />,
    circleWarning: <CircleWarning className={className} size={size} />,
    circleX: <CircleX className={className} size={size} />,
    clock: <Clock className={className} size={size} />,
    close: <Close className={className} size={size} />,
    code: <Code className={className} size={size} />,
    columns: <Columns className={className} size={size} />,
    commit: <Commit className={className} size={size} />,
    dashboard: <Dashboard className={className} size={size} />,
    deployCircle: <DeployCircle className={className} size={size} />,
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
    integer: <Integer className={className} size={size} />,
    loader: <Loader className={className} size={size} />,
    lock: <Lock className={className} size={size} />,
    more: <More className={className} size={size} />,
    myDatasets: <MyDatasets className={className} size={size} />,
    null: <Null className={className} size={size} />,
    number: <Number className={className} size={size} />,
    object: <Object className={className} size={size} />,
    page: <Page className={className} size={size} />,
    play: <Play className={className} size={size} />,
    playCircle: <PlayCircle className={className} size={size} />,
    plus: <Plus className={className} size={size} />,
    readme: <Readme className={className} size={size} />,
    rocket: <Rocket className={className} size={size} />,
    rows: <Rows className={className} size={size} />,
    skinnySearch: <SkinnySearch className={className} size={size} />,
    string: <String className={className} size={size} />,
    structure: <Structure className={className} size={size} />,
    tags: <Tags className={className} size={size} />,
    twitter: <Twitter className={className} size={size} />,
    youtube: <Youtube className={className} size={size} />
  }

  return customIcons[icon] || '?'
}

export default Icon
