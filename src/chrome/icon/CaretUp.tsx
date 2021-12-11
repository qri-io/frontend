import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const CaretDown: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M22 17.5241L12 7.61938L2 17.5241" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default CaretDown
