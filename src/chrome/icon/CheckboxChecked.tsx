import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const CheckBoxChecked: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" stroke="currentColor"/>
    <rect x="5.33325" y="5.33333" width="13.3333" height="13.3333" rx="3" fill="currentColor"/>
  </CustomIcon>
)

export default CheckBoxChecked
