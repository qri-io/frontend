import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import classNames from 'classnames'

import { newQriRef } from '../../qri/ref'
import { Dataset } from '../../qri/dataset'
import { selectDsPreview } from '../dsPreview/state/dsPreviewState'
import { selectSessionUser } from '../session/state/sessionState'
import { selectSessionUserCanEditDataset } from './state/datasetState'
import DatasetHeader from './DatasetHeader'
import DatasetMiniHeader from '../dataset/DatasetMiniHeader'

interface DatasetScrollLayoutProps {
  dataset?: Dataset
  headerChildren?: JSX.Element
  contentClassName?: string
}

const DatasetScrollLayout: React.FC<DatasetScrollLayoutProps> = ({
  dataset,
  headerChildren,
  contentClassName = '',
  children
}) => {
  const qriRef = newQriRef(useParams())
  const dsPreview = useSelector(selectDsPreview)
  const user = useSelector(selectSessionUser)
  const editable = useSelector(selectSessionUserCanEditDataset)
  const isNew = (qriRef.username === 'new')

  const headerDataset = dataset || dsPreview

  // This covers the case where a user created a new workflow before logging in.
  // If they login while working on the workflow, the `user` will change, but the
  // params used to generate the `qriRef` will not (because they are generated
  // from the url, which has not changed). This check ensures that the correct
  // username is propagated after login/signup.
  if (isNew) {
    qriRef.username = user.username
  }

  const { ref: stickyHeaderTriggerRef, inView } = useInView({
    threshold: 0.6,
    initialInView: true
  });

  return (
    <>
      <div className='overflow-y-scroll overflow-x-hidden flex-grow relative'>
        <DatasetMiniHeader dataset={headerDataset} show={!inView} >
          {headerChildren}
        </DatasetMiniHeader>
        <div className={classNames('p-7 w-full', contentClassName)}>
          <div ref={stickyHeaderTriggerRef}>
            <DatasetHeader dataset={headerDataset} editable={editable} showInfo={!dataset}>
              {headerChildren}
            </DatasetHeader>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}



export default DatasetScrollLayout
