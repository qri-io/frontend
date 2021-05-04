import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Download: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M1 16V19C1 20.1046 1.89543 21 3 21H17C18.1046 21 19 20.1046 19 19V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 11L10 15L14 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 1V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </CustomIcon>
)

export default Download
