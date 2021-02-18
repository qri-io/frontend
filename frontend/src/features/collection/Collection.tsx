import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SyncLoader } from 'react-spinners'

import { loadCollection } from './state/collectionActions'
import { selectCollection, selectIsCollectionLoading } from './state/collectionState'
import UserPageLayout from '../app/UserPageLayout'
import WorkflowsTable from './WorkflowsTable'
import { WorkflowInfo } from '../../qrimatic/workflow'

const Collection: React.FC<any> = () => {
  const dispatch = useDispatch()
  const collection = useSelector(selectCollection)
  const loading = useSelector(selectIsCollectionLoading)

  useEffect(() => {
    dispatch(loadCollection(1,50))
  }, [dispatch])

  return (
    <UserPageLayout>
      <div className='h-full max-w-screen-xl mx-auto px-10 py-20'>
        <header className='mb-8'>
          <h1 className='text-2xl font-extrabold'>Collection</h1>
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
    </UserPageLayout>
  )
}

export default Collection
