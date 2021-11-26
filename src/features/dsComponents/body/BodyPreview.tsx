// TODO(chriswhong): BodyPreview and Body should be combined since they share a lot of the same logic
import React from 'react'

import Dataset, { extractColumnHeaders } from '../../../qri/dataset'
import BodyTable from './BodyTable'
import BodyJson from './BodyJson'
import BodyHeader from './BodyHeader'
import ComponentHeader from '../ComponentHeader'
import Spinner from '../../../chrome/Spinner'
import NoBody from './NoBody'

export interface BodyProps {
  dataset: Dataset
  loading: boolean
}

const Body: React.FC<BodyProps> = ({
  dataset,
  loading
}) => {
  const {
    body,
    structure
  } = dataset

  if (loading) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <Spinner color='#43B3B2' />
      </div>
    )
  }

  if (!body) {
    return (
      <NoBody />
    )
  }

  if (!structure) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <div>
          Error cannot show body without a structure
        </div>
      </div>
    )
  }

  const headers = extractColumnHeaders(structure, body)

  return (
    <>
      <ComponentHeader border={false}>
        <BodyHeader dataset={dataset} showExpand={false} loading={loading} />
      </ComponentHeader>
      <div className='overflow-auto flex-grow hide-scrollbar'>
        {
        (structure.format === 'csv' && Array.isArray(body))
          ? <BodyTable
              headers={headers}
              body={body.slice(0, 100)} // TODO(chriswhong): fetch previews/paginated body properly so we aren't rendering extremely large tables
            />
          : <BodyJson
              data={body}
              previewWarning={false}
            />
      }
      </div>
    </>
  )
}

export default Body
