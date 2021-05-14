import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useDimensions from 'react-use-dimensions'

import { loadCollection } from './state/collectionActions'
import { selectCollection, selectIsCollectionLoading } from './state/collectionState'
import PageWithFooter from '../app/PageWithFooter'
import WorkflowsTable from './WorkflowsTable'
import { WorkflowInfo } from '../../qrimatic/workflow'
import Button from '../../chrome/Button'
import Icon from '../../chrome/Icon'
import Spinner from '../../chrome/Spinner'

const Collection: React.FC<any> = () => {
  const dispatch = useDispatch()
  const collection = useSelector(selectCollection)
  const loading = useSelector(selectIsCollectionLoading)

  useEffect(() => {
    loadCollection(dispatch, 1, 50)
  }, [dispatch])

  const [tableContainer, { height: tableContainerHeight }] = useDimensions();

  return (
    <PageWithFooter>
      <div className='h-full' style={{ backgroundColor: '#f3f4f6'}}>
        <div className='h-full w-9/12 mx-auto pt-10 pb-8 flex flex-col'>
          <header className='mb-8 flex text-qrinavy items-end'>
            <div className='flex-grow'>
              <h1 className='text-3xl font-extrabold w-1/2 mb-1'>My Datasets</h1>
              <div className=''>All datasets you own or collaborate on</div>
            </div>
            <div className='w-1/2 text-right'>
            <Link to='/ds/new'>
              <Button type='secondary'>
                New Dataset
              </Button>
            </Link>
            </div>
          </header>
          <div ref={tableContainer} className='overflow-y-hidden rounded-lg relative flex-grow'>
              { loading
                ? <div className='h-full w-full flex justify-center items-center'><Spinner /></div>
                : <WorkflowsTable
                    filteredWorkflows={collection}
                    // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
                    // to its internal the selections
                    clearSelectedTrigger={false}
                    onRowClicked={(row: WorkflowInfo) => {}}
                    onSelectedRowsChange={() => {}}
                    containerHeight={tableContainerHeight}
                  />
              }
          </div>
        </div>
      </div>
    </PageWithFooter>
  )
}

export default Collection
