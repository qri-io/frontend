import React from 'react'
import classNames from 'classnames'
import numeral from 'numeral'
import { Link } from 'react-router-dom'
import ContentLoader from 'react-content-loader'

import DatasetInfoItem from '../dataset/DatasetInfoItem'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import ContentBox from "../../chrome/ContentBox"
import UsernameWithIcon from "../../chrome/UsernameWithIcon"

import { SearchResult } from '../../qri/search'

interface SearchResultItemProps {
  dataset?: SearchResult
  loading?: boolean
  card?: boolean
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ dataset, loading = false, card = false }) => {
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
      followStats
    } = dataset

    const humanRef = `${username}/${name}`
    const title = meta?.title || humanRef

    itemContent = (
      <>
        <Link to={`/${humanRef}`}><div className='text-xs text-qrigray-400 relative flex items-baseline group hover:text mb-1 font-mono hover:underline'>{humanRef}</div></Link>
        <Link to={`/${humanRef}`}><div className='text-xl text-black-500 font-bold hover:text hover:underline overflow-hidden overflow-ellipsis'>{title}</div></Link>
        <div className='text-sm text-qrigray-400 hover:text line-clamp-3 mb-1'>{meta?.description || 'No Description'}</div>
        <div className='flex items-center flex-wrap text-xs'>
          { commit?.timestamp && <DatasetInfoItem size='md' icon='clock' label={<RelativeTimestamp timestamp={new Date(commit.timestamp)} />} />}
          { meta?.structure?.length && <DatasetInfoItem size='md' icon='disk' label={numeral(meta.structure.length).format('0.0b')} />}
          {/* <DatasetInfoItem icon='automationFilled' label='automated' iconClassName='text-qrigreen' /> TODO(chriswhong): enable when we have automation info */}
          {/* <DatasetInfoItem icon='commit' label={`17 versions`} /> TODO(chriswhong): enable when we have commit info */}
          {/* stats?.downloadCount > 0 && <DatasetInfoItem size='md' icon='download' label={`${stats.downloadCount} download${(stats.downloadCount !== 1) ? 's' : ''}`} /> */}
          { followStats.followCount > 0 && <DatasetInfoItem size='md' icon='follower' label={`${followStats.followCount} follower${(followStats.followCount !== 1) ? 's' : ''}`} /> }

          <DatasetInfoItem size='md' icon='lock' label='public' />
          <UsernameWithIcon username={username} />
        </div>
      </>
    )
  }

  return (
    <ContentBox paddingClassName='p-5' className={classNames({
      'pt-2 pb-2 first:pt-0 last:pb-0': !card,
      'mb-7': card
    })} card={card}>
      {itemContent}
    </ContentBox>
  )
}

export default SearchResultItem
