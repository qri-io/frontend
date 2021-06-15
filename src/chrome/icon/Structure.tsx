import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Clock: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
  <rect x="3" y="3" width="3.45455" height="3.45455" rx="1" stroke="currentColor" strokeWidth="2"/>
  <rect x="10.2727" y="3" width="3.45455" height="3.45455" rx="1" stroke="currentColor" strokeWidth="2"/>
  <rect x="17.5454" y="3" width="3.45455" height="3.45455" rx="1" stroke="currentColor" strokeWidth="2"/>
  <rect x="3" y="10.2728" width="3.45455" height="3.45455" rx="1" stroke="currentColor" strokeWidth="2"/>
  <rect x="10.2727" y="10.2728" width="3.45455" height="3.45455" rx="1" stroke="currentColor" strokeWidth="2"/>
  <rect x="17.5454" y="10.2728" width="3.45455" height="3.45455" rx="1" stroke="currentColor" strokeWidth="2"/>
  <rect x="3" y="17.5454" width="3.45455" height="3.45455" rx="1" stroke="currentColor" strokeWidth="2"/>
  <rect x="10.2727" y="17.5454" width="3.45455" height="3.45455" rx="1" stroke="currentColor" strokeWidth="2"/>
  <rect x="17.5454" y="17.5454" width="3.45455" height="3.45455" rx="1" stroke="currentColor" strokeWidth="2"/>
  </CustomIcon>
)

export default Clock
