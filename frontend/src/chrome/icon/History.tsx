import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const History: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M4 10C2.89543 10 2 9.10457 2 8C2 6.89543 2.89543 6 4 6C5.10457 6 6 6.89543 6 8C6 8.53043 5.78929 9.03914 5.41421 9.41421C5.03914 9.78929 4.53043 10 4 10Z" stroke="currentColor" stroke-width="2"/>
    <path d="M4 18C2.89543 18 2 17.1046 2 16C2 14.8954 2.89543 14 4 14C5.10457 14 6 14.8954 6 16C6 17.1046 5.10457 18 4 18Z" stroke="currentColor" stroke-width="2"/>
    <rect x="9" y="6" width="13" height="4" rx="2" stroke="currentColor" stroke-width="2"/>
    <rect x="9" y="14" width="13" height="4" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M4 2V6M4 22V18M4 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </CustomIcon>
)

export default History
