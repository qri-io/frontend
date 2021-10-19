import React from 'react'
import format from 'date-fns/format'
import fromUnixTime from 'date-fns/fromUnixTime'
import ContentLoader from 'react-content-loader'

import ContentBox from '../../chrome/ContentBox'

import { UserProfile } from '../../qri/userProfile'
import {useSelector} from "react-redux";
import {selectSessionUser} from "../session/state/sessionState";


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
  const user = useSelector(selectSessionUser)

  return (
    <ContentBox paddingClassName='w-full ' className='flex h-20 mt-8 mb-6 w-full'>
        <div className='relative'>
          <div className='rounded-full inline-block bg-cover absolute -top-8' style={{
            height: '100px',
            width: '100px',
            backgroundImage: `url(${user.profile})`
          }}/>
        </div>
        <div className='flex-grow ml-32'>
          { loading ? (
            <ContentLoader
              width={300}
              height={80}
            >
              <rect y="0" width="300" height="18" rx="6"/>
              <rect y="30" width="260" height="18" rx="6"/>
              <rect y="60" width="300" height="18" rx="6"/>

            </ContentLoader>
          ) : (
            <>
              <div className='mt-4 text-black text-xl font-medium mb-1'>{name || username}</div>
              {/*TODO(boandriy): Hiding the user name/description until there is an option to edit it*/}
              {/*<div className='text-black text-sm'>{username}</div>*/}
              {/*<div className='text-qrigray-400 text-sm'>{description || 'I\'m a Qri user'}</div>*/}
            </>
          )}
        </div>
        <div className='flex flex-shrink-0 ml-4 flex-col justify-end items-start'>
          { !loading && (
            <>
              {/*TODO(boandriy): Hiding the user socials until there is an option to edit it*/}
              {/*<div className='flex justify-end mb-2'>*/}
              {/*  <IconLink icon='github' className='ml-2' link='https://github.com/chriswhong' />*/}
              {/*  <IconLink icon='twitter' className='ml-2' link='https://twitter.com/chriswhong' />*/}
              {/*  <IconLink icon='globe' className='ml-2' link='https://chriswhong.com' />*/}
              {/*</div>*/}
              <div className='ml-28 text-xs text-qrigray-400'>Qri user since {format(fromUnixTime(created), 'yyyy')}</div>
            </>
          )}
        </div>
    </ContentBox>
  )
}

export default UserProfileHeader
