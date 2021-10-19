import React from 'react'
import ContentLoader from 'react-content-loader'

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
  onParamsUpdate: (newQueryParams: Record<string, any>) => void
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

  const { page } = pageInfo
  const { sort } = userProfileParams
  const totalPages = Math.ceil( pageInfo.resultCount / pageInfo.pageSize )

  // handle page change from PageControl
  const handlePageChange = ({ selected: pageIndex }: PageChangeObject) => {
    onParamsUpdate({ page: pageIndex + 1 })
  }

  const handleSortChange = (sort: 'name' | 'recentlyupdated') => {
    onParamsUpdate({ sort })
  }

  const dropdownSortIcon = <div className='border border-qrigray-300 rounded-lg text-qrigray-400 text-xs font-normal px-2 py-2 cursor-pointer'>
    Sort By
    <Icon icon='caretDown' size='2xs' className='ml-3' />
  </div>

  return (
    <>
      <div className='flex items-center justify-between px-2.5 pb-2'>
        <div className='text-qrigray flex-grow'>
          {
            loading ? (
              <ContentLoader
                width={100}
                height={20}
              >
                <rect y="0" width="100" height="18" rx="6"/>
              </ContentLoader>
            ) : (
              <>Page {page} of {totalPages || 1}</>
            )
          }

        </div>
        <div>
          <DropdownMenu
            icon={dropdownSortIcon}
            className='ml-8'
            items={[
              {
                label: 'Dataset Name',
                active: sort === 'name',
                onClick: () => { handleSortChange('name') }
              },
              {
                label: 'Recently Updated',
                active: sort === 'recentlyupdated',
                onClick: () => { handleSortChange('recentlyupdated') },
              }
            ]}
          />
        </div>
      </div>
      <DatasetList datasets={results} loading={loading} />
      <PageControl
        pageInfo={pageInfo}
        queryParams={CleanUserProfileDatasetListParams(userProfileParams)}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default UserProfileDatasetList
