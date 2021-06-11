import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { useInView } from 'react-intersection-observer'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import {
  loadUserProfile,
  loadUserProfileDatasets,
  loadUserProfileFollowing
} from './state/userProfileActions'
import {
  selectUserProfile,
  selectUserProfileLoading,
  selectUserProfileDatasets,
  selectUserProfileFollowing,
} from './state/userProfileState'
import ContentBox from '../../chrome/ContentBox'
import NavBar from '../navbar/NavBar'
import Footer from '../footer/Footer'
import {
  UserProfileDatasetListParams,
  NewUserProfileDatasetListParams,
  CleanUserProfileDatasetListParams
} from '../../qri/userProfile'
import { ContentTabs, Tab } from '../../chrome/ContentTabs'
import UserProfileHeader from './UserProfileHeader'
import UserProfileDatasetList from './UserProfileDatasetList'

interface UserProfileProps {
  path?: '/' | '/following'
}

const UserProfile: React.FC<UserProfileProps> = ({ path = '/' }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const profile = useSelector(selectUserProfile)
  const loading = useSelector(selectUserProfileLoading)

  const { ref: stickyHeaderTriggerRef, inView } = useInView({
    threshold: 0.6,
    initialInView: true
  });

  const paginatedDatasetResults = useSelector(selectUserProfileDatasets)
  const paginatedFollowingResults = useSelector(selectUserProfileFollowing)

  const scrollContainer = useRef<HTMLDivElement>(null)
  const { username: usernameParam } = useParams();

  const { search } = useLocation()
  const userProfileParams: UserProfileDatasetListParams = NewUserProfileDatasetListParams(queryString.parse(search))
  const { page, sort } = userProfileParams

  // if the query string ever changes, fetch new data
  useEffect(() => {
    dispatch(loadUserProfile(usernameParam))
    dispatch(loadUserProfileDatasets(usernameParam, userProfileParams))
    dispatch(loadUserProfileFollowing(usernameParam, userProfileParams))
  }, [usernameParam, page, sort, dispatch])

  // merges new query params with existing params, updates history
  const updateQueryParams = (newQueryParams: Record<string, any>) => {
    const newParams = {
      ...userProfileParams,
      ...newQueryParams
    }

    // reset page if sort has changed
    if (newParams.sort !== userProfileParams.sort) {
      newParams.page = 1
    }

    // scroll to top if page has changed
    if (scrollContainer.current && (newParams.page !== userProfileParams.page)) {
      scrollContainer.current.scrollTop = 0
    }

    // build a params object excluding undefined or default params, so they don't show up in the URL
    const newParamsObject = new URLSearchParams()
    const cleanParams: Record<string, any> = CleanUserProfileDatasetListParams(newParams)
    Object.keys(cleanParams).forEach((key) => {
      newParamsObject.append(key, cleanParams[key])
    })

    // update the URL
    history.push({ search: newParamsObject.toString() })
  }

  const tabs: Tab[] = [
    {
      name: 'Datasets',
      link: `/${usernameParam}`,
      numberDecorator: paginatedDatasetResults.pageInfo.resultCount,
      selected: path === '/'
    },
    {
      name: 'Following',
      link: `/${usernameParam}/following`,
      numberDecorator: paginatedFollowingResults.pageInfo.resultCount,
      selected: path === '/following'
    }
  ]

  return (
    <div className='flex flex-col h-full w-full' ref={scrollContainer} style={{ backgroundColor: '#f3f4f6'}}>
      <NavBar />
      <div className='flex-grow w-full overflow-y-scroll'>
        {/* begin sticky header */}
        <div className={classNames('sticky bg-white  border border-qrigray-200 z-10', {
          'invisible -top-16 h-0': inView,
          'visible top-0 transition-all': !inView
        })}>
          <div className='px-8 pt-4 pb-3 flex'>
            <div className='flex items-center'>
              <div className='rounded-2xl inline-block bg-cover flex-shrink-0 mr-3' style={{
                height: '30px',
                width: '30px',
                backgroundImage: `url(${profile.profile})`
              }}></div>
              <div>
                <div className='text-qrinavy text-sm font-semibold'>{profile.name}</div>
                <div className='text-qrigray-400 text-xs'>{profile.username}</div>
              </div>
            </div>
          </div>
        </div>
        {/* end sticky header */}
        <div className='mx-auto flex py-9' style={{ maxWidth: '1040px' }}>
          <div className='flex-auto'>
              <div ref={stickyHeaderTriggerRef}>
                <UserProfileHeader profile={profile} loading={loading} />
              </div>
              <ContentTabs
                tabs={tabs}
              />
              <UserProfileDatasetList
                paginatedResults={path === '/' ? paginatedDatasetResults : paginatedFollowingResults}
                userProfileParams={userProfileParams}
                onParamsUpdate={updateQueryParams}
              />
            </div>
          <div className=' flex-none pl-8' style={{ width: '366px' }}>
            <ContentBox>
              Sidebar
            </ContentBox>
          </div>
        </div>
      </div>
      <div className='bg-white flex-shrink-0'>
        <Footer />
      </div>
    </div>
  )
}

export default UserProfile;