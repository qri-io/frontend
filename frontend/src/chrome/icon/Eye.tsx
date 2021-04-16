import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Eye: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12.1315" cy="12.3216" r="2.42105" stroke="currentColor" stroke-width="2"/>
    <path d="M2 12.3216C12.6579 0.347944 22 12.3216 22 12.3216C12 24.6901 2 12.3216 2 12.3216Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </CustomIcon>
)

export default Eye
