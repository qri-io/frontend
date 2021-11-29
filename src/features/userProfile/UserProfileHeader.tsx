import React from 'react'
import format from 'date-fns/format'
import fromUnixTime from 'date-fns/fromUnixTime'
import ContentLoader from 'react-content-loader'

import ContentBox from '../../chrome/ContentBox'

import { UserProfile } from '../../qri/userProfile'
import assignUserIcon from '../../utils/assignUserIcon'

export interface UserProfileHeaderProps {
  profile: UserProfile
  loading: boolean
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ profile, loading = false }) => {
  const {
    name,
    username,
    created
  } = profile

  const userIcon = assignUserIcon(username)

  return (
    <ContentBox paddingClassName='w-full relative flex' className='flex mt-8 mb-6 w-full'>
      <div className='relative'>
        <div className='rounded-full inline-block bg-cover absolute -top-8 left-6' style={{
          height: '100px',
          width: '100px',
          backgroundImage: `url(${userIcon})`
        }}/>
      </div>
      <div className='py-7 pr-7 pl-40'>
        <div>
          { loading
            ? (
              <ContentLoader
                    width={300}
                    height={80}
                  >
                <rect y="0" width="300" height="18" rx="6"/>
                <rect y="30" width="260" height="18" rx="6"/>
                <rect y="60" width="300" height="18" rx="6"/>
              </ContentLoader>
              )
            : (
              <>
                <div className='text-black text-xl font-bold mb-1'>{name || username}</div>
                {/* TODO(boandriy): Hiding the user name/description until there is an option to edit it */}
                {/* <div className='text-black text-sm'>{username}</div> */}
                {/* <div className='text-qrigray-400 text-sm'>{description || 'I\'m a Qri user'}</div> */}
              </>
              )}
        </div>
        <div>
          { !loading && (
          <>
            {/* TODO(boandriy): Hiding the user socials until there is an option to edit it */}
            {/* <div className='flex justify-end mb-2'> */}
            {/*  <IconLink icon='github' className='ml-2' link='https://github.com/chriswhong' /> */}
            {/*  <IconLink icon='twitter' className='ml-2' link='https://twitter.com/chriswhong' /> */}
            {/*  <IconLink icon='globe' className='ml-2' link='https://chriswhong.com' /> */}
            {/* </div> */}
            <div className='text-sm text-qrigray-400'>Qri user since {format(fromUnixTime(created), 'yyyy')}</div>
          </>
          )}
        </div>
      </div>
    </ContentBox>
  )
}

export default UserProfileHeader
