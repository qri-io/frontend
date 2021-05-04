import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Globe: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 2.125V21.875" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2.625 9H21.375" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2.625 15.125H21.375" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 2.25C6.18696 4.59494 5.81591 18.6646 12 21.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 2.25C17.813 4.59494 18.1841 18.6646 12 21.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </CustomIcon>
)

export default Globe
