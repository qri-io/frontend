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
import Circle from './icon/Circle'
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

const Icon: React.FunctionComponent<IconProps> = (props) => {
  const { icon } = props

  const customIcons: {[key: string]: any} = {
    activityFeed: <ActivityFeed {...props} />,
    any: <Any {...props} />,
    array: <Array {...props} />,
    automationFilled: <AutomationFilled {...props} />,
    body: <Body {...props} />,
    boolean: <Boolean {...props} />,
    brackets: <Brackets {...props} />,
    calendar: <Calendar {...props} />,
    caretLeft: <CaretLeft {...props} />,
    caretRight: <CaretRight {...props} />,
    caretDown: <CaretDown {...props} />,
    checkbox: <Checkbox {...props} />,
    checkboxChecked: <CheckboxChecked {...props} />,
    circle: <Circle {...props} />,
    circleCheck: <CircleCheck {...props} />,
    circleDash: <CircleDash {...props} />,
    circleWarning: <CircleWarning {...props} />,
    circleX: <CircleX {...props} />,
    clock: <Clock {...props} />,
    close: <Close {...props} />,
    code: <Code {...props} />,
    columns: <Columns {...props} />,
    commit: <Commit {...props} />,
    dashboard: <Dashboard {...props} />,
    deployCircle: <DeployCircle {...props} />,
    discord: <Discord {...props} />,
    disk: <Disk {...props} />,
    download: <Download {...props} />,
    ellipsesVertical: <EllipsesVertical {...props} />,
    eye: <Eye {...props} />,
    follower: <Follower {...props} />,
    fullScreen: <FullScreen {...props} />,
    github: <Github {...props} />,
    globe: <Globe {...props} />,
    history: <History {...props} />,
    info: <Info {...props} />,
    integer: <Integer {...props} />,
    loader: <Loader {...props} />,
    lock: <Lock {...props} />,
    more: <More {...props} />,
    myDatasets: <MyDatasets {...props} />,
    null: <Null {...props} />,
    number: <Number {...props} />,
    object: <Object {...props} />,
    page: <Page {...props} />,
    play: <Play {...props} />,
    playCircle: <PlayCircle {...props} />,
    plus: <Plus {...props} />,
    readme: <Readme {...props} />,
    rocket: <Rocket {...props} />,
    rows: <Rows {...props} />,
    skinnySearch: <SkinnySearch {...props} />,
    string: <String {...props} />,
    structure: <Structure {...props} />,
    tags: <Tags {...props} />,
    twitter: <Twitter {...props} />,
    youtube: <Youtube {...props} />
  }

  const customIcon = customIcons[icon]

  if (customIcon) {
    return customIcon
  } else {
    console.warn(`warning: an invalid icon '${icon}' was passed into Icon`)
    return '?'
  }
}

export default Icon
