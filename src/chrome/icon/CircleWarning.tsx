import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const CircleWarning: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <g clipPath="url(#clip0)">
      <path d="M11.9995 2C6.47666 2 1.99951 6.47715 1.99951 12C1.99951 17.5228 6.47666 22 11.9995 22C17.5224 22 21.9995 17.5228 21.9995 12C21.9995 6.47715 17.5224 2 11.9995 2Z" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8L12 12" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15.9995L11.9906 15.9995" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
    <clipPath id="clip0">
      <rect width="24" height="24" fill="white" transform="translate(24 24) rotate(-180)"/>
    </clipPath>
    </defs>
  </CustomIcon>
)

export default CircleWarning
