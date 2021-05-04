import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Disk: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M15.1884 15.7102H19.6811" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="2" y="12.5217" width="20" height="6.08696" rx="1.3913" stroke="currentColor" stroke-width="2"/>
    <path d="M2.43481 12.9565L6.43476 6.33592C6.56073 6.12742 6.78658 6 7.03018 6H16.9699C17.2135 6 17.4393 6.12742 17.5653 6.33592L21.5653 12.9565" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </CustomIcon>
)

export default Disk
