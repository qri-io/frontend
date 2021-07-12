import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Calendar: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M18.5556 12.5556V5.45679C18.5556 4.50222 17.7817 3.72839 16.8272 3.72839H4.72839C3.77383 3.72839 3 4.50222 3 5.45679V17.5556C3 18.5101 3.77383 19.2839 4.72839 19.2839H10.7778" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.2345 2V5.45679" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.32104 2V5.45679" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 8.91351H18.5556" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="15.2222" cy="16.4444" r="4.80556" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15.2223 13.6667V16.9075L16.6112 18.2964" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default Calendar
