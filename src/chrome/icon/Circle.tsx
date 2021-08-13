import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Circle: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
  </CustomIcon>
)

export default Circle
