import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'

import { loadCollection } from './state/collectionActions'
import { selectCollection, selectIsCollectionLoading } from './state/collectionState'
import Page from '../app/Page'
import WorkflowsTable from './WorkflowsTable'
import { WorkflowInfo } from '../../qrimatic/workflow'
import Button from '../../chrome/Button'
import Icon from '../../chrome/Icon'

const Collection: React.FC<any> = () => {
  const dispatch = useDispatch()
  const collection = useSelector(selectCollection)
  const loading = useSelector(selectIsCollectionLoading)

  useEffect(() => {
    loadCollection(dispatch, 1, 50)
  }, [dispatch])

  return (
    <Page>
      <div className='h-full max-w-screen-xl mx-auto px-10 py-20'>
      <header className='mb-8 flex'>
        <h1 className='text-2xl font-extrabold w-1/2'>Collection</h1>
        <div className='w-1/2 text-right'>
        <Link to='/ds/new'>
          <Button>
            <Icon icon='plusCircle' className='mr-2' size='md'/> New Dataset
          </Button>
        </Link>
        </div>
      </header>

        { loading
          ? <div className='h-full w-full flex justify-center items-center'><SyncLoader /></div>
          : <WorkflowsTable
              filteredWorkflows={collection}
              // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
              // to its internal the selections
              clearSelectedTrigger={false}
              onRowClicked={(row: WorkflowInfo) => {}}
              onSelectedRowsChange={() => {}}
            />
        }
      </div>
    </Page>
  )
}

export default Collection
