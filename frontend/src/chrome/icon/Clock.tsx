import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Clock: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
    <path d="M12 7V12.8333L14.5 15.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </CustomIcon>
)

export default Clock
