import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const EllipsesVertical: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M10.5 12C10.5 12.6904 11.0596 13.25 11.75 13.25C12.4404 13.25 13 12.6904 13 12C13 11.3096 12.4404 10.75 11.75 10.75C11.0596 10.75 10.5 11.3096 10.5 12Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 20.75C10.5 21.4404 11.0596 22 11.75 22C12.4404 22 13 21.4404 13 20.75C13 20.0596 12.4404 19.5 11.75 19.5C11.0596 19.5 10.5 20.0596 10.5 20.75Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 3.25C10.5 3.94036 11.0596 4.5 11.75 4.5C12.4404 4.5 13 3.94036 13 3.25C13 2.55964 12.4404 2 11.75 2C11.0596 2 10.5 2.55964 10.5 3.25Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default EllipsesVertical
