import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const CaretRight: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M7.09524 22L17 12L7.09524 2" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </CustomIcon>
)

export default CaretRight
