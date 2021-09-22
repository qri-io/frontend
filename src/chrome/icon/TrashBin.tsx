import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const TrashBin: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M3 6H5H21" stroke="#1B3356" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V4C8 3.46956 8.21072 2.96086 8.58578 2.58578C8.96086 2.21072 9.46956 2 10 2H14C14.5304 2 15.0391 2.21072 15.4142 2.58578C15.7893 2.96086 16 3.46956 16 4V6H8ZM19 6V20C19 20.5304 18.7893 21.0392 18.4142 21.4142C18.0391 21.7892 17.5304 22 17 22H7C6.46956 22 5.96086 21.7892 5.58578 21.4142C5.21072 21.0392 5 20.5304 5 20V6H19Z" stroke="#1B3356" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11V17" stroke="#1B3356" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11V17" stroke="#1B3356" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default TrashBin
