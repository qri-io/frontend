import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const FaceMeh: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 22.6194C17.5228 22.6194 22 18.1422 22 12.6194C22 7.09654 17.5228 2.61938 12 2.61938C6.47715 2.61938 2 7.09654 2 12.6194C2 18.1422 6.47715 22.6194 12 22.6194Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 15.6194H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9.61938H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9.61938H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default FaceMeh
