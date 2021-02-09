import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { useParams } from 'react-router-dom';

import { newQriRef } from '../../qri/ref';
import Workflow from '../workflow/Workflow';
import DatasetComponents from './DatasetComponents';
import { loadDataset } from './state/datasetActions'
import NavBar from '../navbar/NavBar';
import DatasetNavSidebar from './DatasetNavSidebar';
import DatasetTitleMenu from './DatasetTitleMenu';
import DeployingScreen from '../deploy/DeployingScreen';
import DatasetActivityFeed from '../activityFeed/DatasetActivityFeed';

const Dataset: React.FC<any> = () => {
  const qriRef = newQriRef(useParams())
  const dispatch = useDispatch()
  const { url } = useRouteMatch()

  useEffect(() => {
    dispatch(loadDataset(qriRef))
  }, [dispatch, qriRef])

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
        <div className='h-full overflow-hidden flex-grow'>
          <Switch>
            <Route path='/ds/:username/:dataset' exact><Workflow qriRef={qriRef} /></Route>
            <Route path='/ds/:username/:dataset/components'><Redirect to={`${url}/body`} /></Route>
            <Route path='/ds/:username/:dataset/components/:componentName'><DatasetComponents /></Route>
            <Route path='/ds/:username/:dataset/history'><DatasetActivityFeed qriRef={qriRef} /></Route>
          </Switch>
        </div>
        <DeployingScreen qriRef={qriRef} />
      </div>
    </div>
  )
}

export default Dataset;
