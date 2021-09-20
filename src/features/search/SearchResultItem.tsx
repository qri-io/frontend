import React from 'react'
import numeral from 'numeral'
import { Link } from 'react-router-dom'
import ContentLoader from 'react-content-loader'

import DatasetInfoItem from '../dataset/DatasetInfoItem'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'

import { SearchResult } from '../../qri/search'

interface SearchResultItemProps {
  dataset?: SearchResult
  loading?: boolean
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ dataset, loading=false }) => {
    let itemContent

    if (loading) {
      itemContent = (
        <ContentLoader viewBox="0 0 780 126">
          <rect width="448" height="22" rx="6"/>
          <rect y="30" width="401" height="29" rx="6"/>
          <rect y="73" width="674" height="17" rx="6"/>
          <rect y="101" width="420" height="25" rx="6"/>
        </ContentLoader>
      )
    } else if (dataset) {
      const {
        username,
        name,
        meta,
        commit,
        stats,
        followStats
      } = dataset

      const humanRef = `${username}/${name}`
      const title = meta?.title || humanRef
      const timestamp = new Date(commit.timestamp)

      itemContent = (
        <>
          <Link to={`/ds/${humanRef}`}><div className='text-sm text-gray-400 relative flex items-baseline group hover:text mb-2 font-mono hover:underline'>{humanRef}</div></Link>
          <Link to={`/ds/${humanRef}`}><div className='text-xl text-black-500 font-medium hover:text hover:underline mb-1'>{title}</div></Link>
          <div className='text-sm text-qrigray hover:text line-clamp-3 mb-2'>{meta?.description || 'No Description'}</div>
          <div className='flex items-center flex-wrap'>
            <DatasetInfoItem icon='clock' label={<RelativeTimestamp timestamp={timestamp} />} />
            { meta?.structure?.length && <DatasetInfoItem icon='disk' label={numeral(meta.structure.length).format('0.0b')} />}
            {/* <DatasetInfoItem icon='automationFilled' label='automated' iconClassName='text-qrigreen' /> TODO(chriswhong): enable when we have automation info */}
            {/* <DatasetInfoItem icon='commit' label={`17 versions`} /> TODO(chriswhong): enable when we have commit info */}
            { stats?.downloadCount > 0 && <DatasetInfoItem icon='download' label={`${stats.downloadCount} download${(stats.downloadCount !== 1) ? 's' : ''}`} /> }
            { followStats.followCount > 0 && <DatasetInfoItem icon='follower' label={`${followStats.followCount} follower${(followStats.followCount !== 1) ? 's' : ''}`} /> }

            <DatasetInfoItem icon='lock' label='public' />
          </div>
        </>
      )
    }

    return (
      <div className='pt-5 pb-3 border-b border-qrigray-200 last:border-b-0 first:pt-0 last:pb-0'>
        {itemContent}
      </div>
    )
  }

export default SearchResultItem
