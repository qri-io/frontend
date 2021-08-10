import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { newQriRef } from '../../qri/ref'
import { selectDsPreview } from '../dsPreview/state/dsPreviewState'
import { selectSessionUser } from '../session/state/sessionState'
import { selectSessionUserCanEditDataset } from './state/datasetState'
import DatasetHeader from './DatasetHeader'
import DeployingScreen from '../deploy/DeployingScreen'

interface DatasetFixedLayoutProps {
  headerChildren?: JSX.Element
}

const DatasetFixedLayout: React.FC<DatasetFixedLayoutProps> = ({
  headerChildren,
  children
}) => {
  const qriRef = newQriRef(useParams())
  const dsPreview = useSelector(selectDsPreview)
  const user = useSelector(selectSessionUser)
  const editable = useSelector(selectSessionUserCanEditDataset)
  const isNew = (qriRef.username === 'new')

  // This covers the case where a user created a new workflow before logging in.
  // If they login while working on the workflow, the `user` will change, but the
  // params used to generate the `qriRef` will not (because they are generated
  // from the url, which has not changed). This check ensures that the correct
  // username is propagated after login/signup.
  if (isNew) {
    qriRef.username = user.username
  }

  return (
    <>
        <div className='flex flex-col flex-grow overflow-hidden p-7'>
          <DatasetHeader dataset={dsPreview} editable={editable}>
            {headerChildren}
          </DatasetHeader>
          {children}
        </div>
        <DeployingScreen qriRef={qriRef} />
    </>
  )
}

export default DatasetFixedLayout
