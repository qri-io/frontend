import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router';
import { useParams } from 'react-router-dom';

import { newQriRef } from '../../qri/ref';
import HistoryList from '../history/HistoryList';
import WorkflowEditor from '../workflow/WorkflowEditor';
import DatasetComponents from './DatasetComponents';
import { loadDataset } from './state/datasetActions'
import NavBar from '../../chrome/NavBar'

const SideNavItem: React.FC<any> = () => {
  return (
    <div className='bg-gray-600 h-10 w-10 m-4 rounded'></div>
  )
}

const Dataset: React.FC<any> = () => {
  const qriRef = newQriRef(useParams())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadDataset(qriRef))
  }, [dispatch, qriRef])

  return (
    <div className='flex flex-col h-full'>
      <NavBar qriRef={qriRef} />
      <div className='flex flex-grow overflow-hidden'>
        <div className='side-nav bg-gray-300 h-full'>
          <SideNavItem />
          <SideNavItem />
          <SideNavItem />
        </div>
        <div className='h-full'>
          <Switch>
            <Route path='/ds/:username/:dataset' exact><WorkflowEditor qriRef={qriRef} /></Route>
            <Route path='/ds/:username/:dataset/components'><DatasetComponents /></Route>
            <Route path='/ds/:username/:dataset/history'><HistoryList /></Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default Dataset;
