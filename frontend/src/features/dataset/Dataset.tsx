import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { useParams } from 'react-router-dom';
import SyncLoader from 'react-spinners/SyncLoader'

import { newQriRef } from '../../qri/ref';
import HistoryList from '../history/HistoryList';
import Workflow from '../workflow/Workflow';
import DatasetComponents from './DatasetComponents';
import { loadDataset } from './state/datasetActions'
import NavBar from '../navbar/NavBar';
import DatasetNavSidebar from './DatasetNavSidebar';
import DatasetTitleMenu from './DatasetTitleMenu';

const Dataset: React.FC<any> = () => {
  const qriRef = newQriRef(useParams())
  const dispatch = useDispatch()
  const { url } = useRouteMatch()

  useEffect(() => {
    dispatch(loadDataset(qriRef))
  }, [dispatch, qriRef])

  const [showSpinner, setShowSpinner] = useState(false)

  return (
    <div className='flex flex-col h-full' style={{ backgroundColor: '#F4F7FC'}}>
      <NavBar menu={[
        { type: 'link', label: 'back to collection', to: '/collection' },
        { type: 'hr' }
      ]}>
        <DatasetTitleMenu qriRef={qriRef} />
      </NavBar>
      <div className='flex flex-grow overflow-hidden relative'>
        <DatasetNavSidebar qriRef={qriRef} />
        <div className='h-full overflow-hidden'>
          <Switch>
            <Route path='/ds/:username/:dataset' exact><Workflow qriRef={qriRef} /></Route>
            <Route path='/ds/:username/:dataset/components'><Redirect to={`${url}/body`} /></Route>
            <Route path='/ds/:username/:dataset/components/:componentName'><DatasetComponents /></Route>
            <Route path='/ds/:username/:dataset/history'><HistoryList /></Route>
          </Switch>
        </div>
        {
          showSpinner && (
            <div className='absolute h-full flex-grow w-full bg-white z-20 flex flex-col items-center justify-center'>
              <div className='mx-auto mb-8'>
                <SyncLoader color='#4FC7F3' />
              </div>
              <div className="text-3xl font-bold leading-tighter tracking-tighter mb-4  mx-auto">
                Deploying workflow...
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Dataset;
