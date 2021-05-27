import React from 'react'
import numeral from 'numeral'
import { Link } from 'react-router-dom'

import DatasetInfoItem from '../dataset/DatasetInfoItem'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'

import { SearchResult } from '../../qri/search'

interface SearchResultItemProps {
  dataset: SearchResult
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ dataset }) => {
    const {
      peername,
      name,
      meta,
      commit,
      structure,
      stats,
      followStats
    } = dataset
    const datasetReference = `${peername}/${name}`
    let { title, description } = meta
    if (title === undefined) {
      title = datasetReference
    }

    const timestamp = new Date(commit.timestamp)

    const userIcon = (
      <div className='rounded-xl inline-block mr-1 bg-cover flex-shrink-0' style={{
        height: '18px',
        width: '18px',
        backgroundImage: 'url(https://qri-user-images.storage.googleapis.com/1570029763701.png)'
      }} />
    )

    return (
      <div key={datasetReference} className='pt-5 pb-6 border-b border-qrigray-200 last:border-b-0'>
        <Link to={`/ds/${datasetReference}`}><div className='text-sm text-gray-400 relative flex items-baseline group hover:text mb-2 font-mono hover:underline'>{datasetReference}</div></Link>
        <Link to={`/ds/${datasetReference}`}><div className='text-xl text-qrinavy-500 font-medium hover:text hover:underline mb-3'>{title}</div></Link>
        {description && (<div className='text-sm text-qrigray hover:text line-clamp-3 mb-3'>{description}</div>)}
        <div className='flex items-center'>
          <DatasetInfoItem icon='clock' label={<RelativeTimestamp timestamp={timestamp} />} />
          <DatasetInfoItem icon={userIcon} label={peername} />
          <DatasetInfoItem icon='disk' label={numeral(structure.length).format('0.0b')} />
          {/* <DatasetInfoItem icon='automationFilled' label='automated' iconClassName='text-qrigreen' /> TODO(chriswhong): enable when we have automation info */}
          <DatasetInfoItem icon='commit' label={`17 versions`} />
          <DatasetInfoItem icon='download' label={`${stats.downloadCount} download${(stats.downloadCount !== 1) ? 's' : ''}`} />
          <DatasetInfoItem icon='follower' label={`${followStats.followCount} follower${(followStats.followCount !== 1) ? 's' : ''}`} />
          <DatasetInfoItem icon='lock' label='public' />
        </div>
      </div>
    )
  }

export default SearchResultItem
