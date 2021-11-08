import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { loadCollection } from '../collection/state/collectionActions'
import { selectCollection, selectIsCollectionLoading } from '../collection/state/collectionState'
import Page from '../app/Page'
import CollectionTable from '../collection/CollectionTable'
import Button from '../../chrome/Button'
import ActivityList from '../activityFeed/ActivityList'
import { LogItem } from '../../qri/log'
import Spinner from '../../chrome/Spinner'

import activity from '../activityFeed/stories/data/activityLog.json'

const Dashboard: React.FC<any> = () => {
  const dispatch = useDispatch()
  const collection = useSelector(selectCollection)
  const loading = useSelector(selectIsCollectionLoading)

  useEffect(() => {
    loadCollection()
  }, [dispatch])

  return (
    <Page>
      <div className='h-full max-w-screen-xl mx-auto px-10 py-20'>
        <header className='mb-8 flex'>
          <h1 className='text-2xl font-extrabold w-1/2'>Dashboard</h1>
          <div className='w-1/2 text-right'>
            <Link to='/new'>
              <Button icon='plus'>New Dataset</Button>
            </Link>
          </div>
        </header>

        <div className='w-full mb-8 flex flex-wrap -mx-2 overflow-hidden'>
          <div className='my-2 px-2 w-1/2 overflow-hidden'>
            <div className='text-xl font-semibold mb-2'>Getting started</div>
            <div className='border p-4 mb-3 bg-blue-100 rounded mb-8'>
              <p className='mb-2'>Welcome to Qrimatic!  We&apos;ve built a platform for quickly creating automated dataset workflows. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum varius turpis id laoreet. Morbi a sem at dui congue elementum ut at neque. Pellentesque fermentum orci odio, quis lobortis eros vulputate imperdiet. </p>
              <ul className='list-disc ml-4'>
                <li>Use our scripting environment to craft a workflow that updates a dataset</li>
                <li>Schedule your workflow to run as often as you need it to</li>
                <li>Set up notifications and other actions we should take when your script runs</li>
                <li>Check out this dashboard to see how your script has performed</li>
              </ul>
            </div>
          </div>
          <div className='my-2 px-2 w-1/2 overflow-hidden'>
            <div className='text-xl font-semibold mb-2'>Recently Edited Datasets</div>
            <div className='rounded shadow border px-4 mb-4 overflow-hidden'>
              { loading
                ? <div className='h-full w-full flex justify-center items-center'><Spinner /></div>
                : <CollectionTable
                    filteredWorkflows={collection.slice(0, 4)}
                    // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
                    // to its internal the selections
                    clearSelectedTrigger={false}
                    onSelectedRowsChange={() => {}}
                    simplified
                    containerHeight={1000}
                  />
              }
            </div>
            <div className='text-right'>
              <Link to='/collection'>
                <Button caret>View All Datasets</Button>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className='text-xl font-semibold mb-3'>Recent Activity</div>
          <div className='rounded shadow border px-4 mb-4'>
            { loading
              ? <div className='h-full w-full flex justify-center items-center'><Spinner /></div>
              : <ActivityList log={activity as LogItem[]} containerHeight={1000} />
            }
          </div>
          <div className='text-right'>
            <Link to='/activity'>
              <Button caret>View All Activity</Button>
            </Link>
          </div>
        </div>
      </div>

    </Page>
  )
}

export default Dashboard
