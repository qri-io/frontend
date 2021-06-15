import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Close: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M3 3.24994L20.5 20.7499" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 20.7501L20.5 3.25006" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default Close
