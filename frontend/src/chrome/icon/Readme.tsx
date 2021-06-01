import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Clock: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="6.16667" cy="13.8333" r="3.16667" stroke="currentColor" strokeWidth="2"/>
    <circle r="3.16667" transform="matrix(-1 0 0 1 17.8333 13.8333)" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 13.6667H14" stroke="currentColor" strokeWidth="2"/>
    <path d="M2.33325 14V8.83333C2.33325 6.71624 4.04949 5 6.16659 5V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.6667 14V8.83333C21.6667 6.71624 19.9505 5 17.8334 5V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default Clock
