import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const DashedCircle: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M1.375 11C1.375 5.68426 5.68426 1.375 11 1.375C16.3157 1.375 20.625 5.68426 20.625 11C20.625 16.3157 16.3157 20.625 11 20.625C5.68426 20.625 1.375 16.3157 1.375 11Z" stroke="#EC325A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 4"/>
  </CustomIcon>
)

export default DashedCircle
