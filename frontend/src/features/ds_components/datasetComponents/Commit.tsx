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
    <div id='history-commit' className='margin'>
      <h4>{data.title}</h4>
      <h6>{moment(data.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</h6>
      <div>{data.message}</div>
    </div>
  )
}

export default CommitComponent