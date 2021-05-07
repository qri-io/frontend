import React from 'react'

interface UsernameWithIconProps {
  username: string
  className?: string
}

// TODO(chriswhong): make the prop a user object, or pass in icon URL as a separate prop
const UsernameWithIcon: React.FunctionComponent<UsernameWithIconProps> = ({
  username,
  className
}) => (
   <div className={`flex flex-grow text-xs tracking-wider leading-snug ${className}`}>
     <div className='rounded-xl inline-block mr-1 bg-cover' style={{
       height: '18px',
       width: '18px',
       backgroundImage: 'url(https://qri-user-images.storage.googleapis.com/1570029763701.png)'
     }}></div>
     {username}
   </div>
)

export default UsernameWithIcon
