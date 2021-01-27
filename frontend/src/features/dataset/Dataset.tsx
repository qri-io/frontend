import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router';
import { useParams } from 'react-router-dom';

import { newQriRef } from '../../qri/ref';
import HistoryList from '../history/HistoryList';
import Workflow from '../workflow/Workflow';
import DatasetComponents from './DatasetComponents';
import { loadDataset } from './state/datasetActions'
import NavBar from '../navbar/NavBar';
import DatasetNavSidebar from './DatasetNavSidebar';

const Dataset: React.FC<any> = () => {
  const qriRef = newQriRef(useParams())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadDataset(qriRef))
  }, [dispatch, qriRef])

  return (
    <div className='flex flex-col h-full bg-gray-100'>
      <NavBar menu={[
        { type: 'link', label: 'back to collection', to: '/collection' },
        { type: 'hr' }
      ]}>
        <p className='font-bold text-white'>{qriRef.username} / {qriRef.name}</p>
      </NavBar>
      <div className='flex flex-grow overflow-hidden'>
        <DatasetNavSidebar qriRef={qriRef} />
        <div className='h-full'>
          <Switch>
            <Route path='/ds/:username/:dataset' exact><Workflow qriRef={qriRef} /></Route>
            <Route path='/ds/:username/:dataset/components'><DatasetComponents /></Route>
            <Route path='/ds/:username/:dataset/history'><HistoryList /></Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default Dataset;
