import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const CaretLeft: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M16.9048 22L7 12L16.9048 2" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </CustomIcon>
)

export default CaretLeft
