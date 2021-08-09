import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Boolean: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M9 11.3L11.7692 14L21 5" stroke="currentColor" strokeWidth="2.33" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 12V18.2222C20 18.6937 19.8127 19.1459 19.4793 19.4793C19.1459 19.8127 18.6937 20 18.2222 20H5.77778C5.30628 20 4.8541 19.8127 4.5207 19.4793C4.1873 19.1459 4 18.6937 4 18.2222V5.77778C4 5.30628 4.1873 4.8541 4.5207 4.5207C4.8541 4.1873 5.30628 4 5.77778 4H15.5556" stroke="currentColor" strokeWidth="2.33" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default Boolean
