import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const CheckBox: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" stroke="currentColor"/>
  </CustomIcon>
)

export default CheckBox
