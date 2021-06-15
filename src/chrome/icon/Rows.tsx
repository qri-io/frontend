import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Rows: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M20.75 5.5H3.25C2.55964 5.5 2 4.94036 2 4.25C2 3.55964 2.55964 3 3.25 3H20.75C21.4404 3 22 3.55964 22 4.25C22 4.94036 21.4404 5.5 20.75 5.5Z" fill="currentColor"/>
    <path d="M20.75 13H3.25C2.55964 13 2 12.4404 2 11.75C2 11.0596 2.55964 10.5 3.25 10.5H20.75C21.4404 10.5 22 11.0596 22 11.75C22 12.4404 21.4404 13 20.75 13Z" fill="currentColor"/>
    <path d="M20.75 20.4999H3.25C2.55964 20.4999 2 19.9403 2 19.2499C2 18.5596 2.55964 17.9999 3.25 17.9999H20.75C21.4404 17.9999 22 18.5596 22 19.2499C22 19.9403 21.4404 20.4999 20.75 20.4999Z" fill="currentColor"/>
  </CustomIcon>
)

export default Rows
