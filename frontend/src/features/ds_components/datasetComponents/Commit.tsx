import React from 'react'
import moment from 'moment'

import { Commit } from '../../../qri/dataset'

// import { connectComponentToProps } from '../../../utils/connectComponentToProps'

// import { selectDatasetCommit, selectDatasetIsLoading } from '../../../selections'

// import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'

export interface CommitProps {
  data?: Commit
  // loading: boolean
}

export const CommitComponent: React.FunctionComponent<CommitProps> = ({
  data
  // loading
}) => {
  // if (loading) {
  //   return <SpinnerWithIcon loading />
  // }

  if (!data) return null

  return (
    <div className='p-3 h-full w-full overflow-auto pb-8'>
      <div className='font-semibold mb-2'>{data.title}</div>
      <div className='text-sm mb-2'>{moment(data.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</div>
      <div className='text-sm'>{data.message}</div>
    </div>
  )
}

export default CommitComponent
