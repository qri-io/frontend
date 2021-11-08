import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Clock: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M9.44678 10.8262H14.9787" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <mask id="path-2-inside-1" fill="white">
      <rect x="2" y="4" width="20" height="4.25532" rx="1.02128"/>
    </mask>
    <rect x="2" y="4" width="20" height="4.25532" rx="1.02128" stroke="currentColor" strokeWidth="4" mask="url(#path-2-inside-1)"/>
    <mask id="path-3-inside-2" fill="white">
      <path d="M3.27661 6.57092H20.7234V18.7411C20.7234 19.3052 20.2662 19.7624 19.7021 19.7624H4.29789C3.73385 19.7624 3.27661 19.3052 3.27661 18.7411V6.57092Z"/>
    </mask>
    <path d="M3.27661 6.57092H20.7234V18.7411C20.7234 19.3052 20.2662 19.7624 19.7021 19.7624H4.29789C3.73385 19.7624 3.27661 19.3052 3.27661 18.7411V6.57092Z" stroke="currentColor" strokeWidth="4" mask="url(#path-3-inside-2)"/>
  </CustomIcon>
)

export default Clock
