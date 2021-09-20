import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const UpArrow: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 19V5" stroke="black" strokeWidth='2' strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12L12 5L19 12" stroke="black" strokeWidth='2' strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default UpArrow
