import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Duplicate: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M20 9H11C9.89544 9 9 9.89544 9 11V20C9 21.1046 9.89544 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89544 21.1046 9 20 9Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 15H4C3.46956 15 2.96086 14.7893 2.58578 14.4142C2.21072 14.0391 2 13.5304 2 13V4C2 3.46956 2.21072 2.96086 2.58578 2.58578C2.96086 2.21072 3.46956 2 4 2H13C13.5304 2 14.0391 2.21072 14.4142 2.58578C14.7893 2.96086 15 3.46956 15 4V5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default Duplicate



