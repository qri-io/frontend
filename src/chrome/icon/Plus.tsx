import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Plus: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default Plus
