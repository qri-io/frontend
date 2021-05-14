import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const CheckBox: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
  </CustomIcon>
)

export default CheckBox
