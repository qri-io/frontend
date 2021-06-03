import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const CaretDown: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M22 7.09524L12 17L2 7.09524" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default CaretDown
