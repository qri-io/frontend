import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { newQriRef } from '../../qri/ref'
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
  const editable = useSelector(selectSessionUserCanEditDataset)

  return (
    <>
      <div className='flex flex-col flex-grow overflow-hidden p-7 bg-qrigray-100' style={{ borderTopLeftRadius: 20 }}>
        <DatasetHeader editable={editable}>
          {headerChildren}
        </DatasetHeader>
        {children}
      </div>
      <DeployingScreen qriRef={qriRef} />
    </>
  )
}

export default DatasetFixedLayout
