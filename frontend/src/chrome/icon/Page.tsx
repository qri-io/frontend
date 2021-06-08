import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Page: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default Page
