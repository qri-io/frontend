import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const ActivityFeed: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M14.375 2H6.25L5 12.625H11.25L9.375 22L18.75 7.625H11.25L14.375 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default ActivityFeed
