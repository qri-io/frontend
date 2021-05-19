import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const AutomationFilled: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <rect x="8.33325" y="2" width="7.33333" height="5.33333" rx="1" fill="currentColor"/>
    <rect x="3" y="16.6666" width="7.33333" height="5.33333" rx="1" fill="currentColor"/>
    <rect x="13.6667" y="16.6666" width="7.33333" height="5.33333" rx="1" fill="currentColor"/>
    <path d="M12.0001 7.33336V12M12.0001 12H7.66675C7.11446 12 6.66675 12.4477 6.66675 13V16.6667M12.0001 12H16.3334C16.8857 12 17.3334 12.4477 17.3334 13V16.6667" stroke="currentColor" strokeLinecap="round"/>
  </CustomIcon>
)

export default AutomationFilled
