import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const Follower: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M15.6364 20.3637V18.5455C15.6364 17.5811 15.2532 16.6561 14.5713 15.9742C13.8893 15.2922 12.9644 14.9091 12 14.9091H5.63636C4.67194 14.9091 3.74702 15.2922 3.06507 15.9742C2.38312 16.6561 2 17.5811 2 18.5455V20.3637" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.81813 11.2727C10.8264 11.2727 12.4545 9.64467 12.4545 7.63636C12.4545 5.62806 10.8264 4 8.81813 4C6.80982 4 5.18176 5.62806 5.18176 7.63636C5.18176 9.64467 6.80982 11.2727 8.81813 11.2727Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.2727 8.54547V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 11.2727H16.5454" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
)

export default Follower
