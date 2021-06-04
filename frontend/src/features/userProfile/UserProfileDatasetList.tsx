import React from 'react'
import ContentLoader from 'react-content-loader'

import ContentBox from '../../chrome/ContentBox'
import PageControl from '../../chrome/PageControl'
import DropdownMenu from '../../chrome/DropdownMenu'
import DatasetList from '../../chrome/DatasetList'
import Icon from '../../chrome/Icon'
import {
  UserProfileDatasetListParams,
  CleanUserProfileDatasetListParams
} from '../../qri/userProfile'
import { PaginatedResults } from './state/userProfileState'
import { PageChangeObject } from '../../chrome/PageControl'

export interface UserProfileDatasetListProps {
  paginatedResults: PaginatedResults
  userProfileParams: UserProfileDatasetListParams
  onParamsUpdate: (newQueryParams: UserProfileDatasetListParams) => void
}

const UserProfileDatasetList: React.FC<UserProfileDatasetListProps> = ({
  paginatedResults,
  userProfileParams,
  onParamsUpdate
}) => {
  const {
    results,
    pageInfo,
    loading
  } = paginatedResults

  const {
    page,
  } = pageInfo

  const {
    sort
  } = userProfileParams

  const menuItems = [
    {
      text: 'Dataset Name',
      active: sort === 'name',
      onClick: () => { onParamsUpdate({ sort: 'name' }) }
    },
    {
      text: 'Recently Updated',
      active: sort === 'recentlyupdated',
      onClick: () => { onParamsUpdate({ sort: 'recentlyupdated' }) }
    }
  ]

  const totalPages = Math.ceil( pageInfo.resultCount / pageInfo.pageSize )

  // handle page change from PageControl
  const handlePageChange = ({ selected: pageIndex }: PageChangeObject) => {
    onParamsUpdate({ page: pageIndex + 1 })
  }

  return (
    <>
      <ContentBox className='mb-6 rounded-tl-none pt-5 pb-5 pr-5 pl-5'>
        <div className='flex items-center justify-between border-b pb-5'>
          <div className='text-qrigray'>
            {
              loading ? (
                <ContentLoader
                  width={100}
                  height={20}
                >
                  <rect y="0" width="100" height="18" rx="6"/>
                </ContentLoader>
              ) : (
                <>Page {page} of {totalPages}</>
              )
            }

          </div>
          <DropdownMenu items={menuItems} className='ml-8'>
            <div className='border border-qrigray-300 rounded-lg text-qrigray-400 text-xs font-normal px-2 py-2 cursor-pointer'>
              Sort By
              <Icon icon='caretDown' size='2xs' className='ml-3' />
            </div>
          </DropdownMenu>
        </div>
        <DatasetList datasets={results} loading={loading} />
      </ContentBox>
      <PageControl
        pageInfo={pageInfo}
        queryParams={CleanUserProfileDatasetListParams(userProfileParams)}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default UserProfileDatasetList
