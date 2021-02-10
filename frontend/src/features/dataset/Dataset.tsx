import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { useParams } from 'react-router-dom';

import { newQriRef } from '../../qri/ref';
import Workflow from '../workflow/Workflow';
import DatasetComponents from './DatasetComponents';
import { loadBody, loadDataset } from './state/datasetActions'
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
      const ref = newQriRef({username: qriRef.username, name: qriRef.name, path: qriRef.path})
      dispatch(loadDataset(ref))
      dispatch(loadBody(ref))
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path])

  return (
    <div className='flex flex-col h-full w-full' style={{ backgroundColor: '#F4F7FC'}}>
      <NavBar menu={[
        { text: 'back to collection', link: '/collection', icon: 'arrowLeft' },
      ]}>
        <DatasetTitleMenu qriRef={qriRef} />
      </NavBar>
      <div className='flex flex-grow h-full w-full overflow-hidden relative'>
        <DatasetNavSidebar qriRef={qriRef} />
        <Switch>
          <Route path='/ds/:username/:name/workflow'><Workflow qriRef={qriRef} /></Route>
          <Route path='/ds/:username/:name' exact><Redirect to={`${url}/workflow`} /></Route>
          <Route path='/ds/:username/:name/components/:component'><DatasetComponents /></Route>
          <Route path='/ds/:username/:name/components'><Redirect to={`${url}/components/body`} /></Route>
          <Route path='/ds/:username/:name/history'><DatasetActivityFeed /></Route>
        </Switch>
        <DeployingScreen qriRef={qriRef} />
      </div>
    </div>
  )
}

export default Dataset;
