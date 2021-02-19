import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { useParams } from 'react-router-dom';

import { newQriRef } from '../../qri/ref';
import Workflow from '../workflow/Workflow';
import DatasetComponents from './DatasetComponents';
import { loadBody, loadDataset } from './state/datasetActions'
import UserNavBar from '../navbar/UserNavBar';
import DatasetNavSidebar from './DatasetNavSidebar';
import DatasetTitleMenu from './DatasetTitleMenu';
import DeployingScreen from '../deploy/DeployingScreen';
import DatasetActivityFeed from '../activityFeed/DatasetActivityFeed';

export interface DatasetMenuItem {
  text: string
  link: string
  icon?: string
}

const Dataset: React.FC<any> = () => {
  const qriRef = newQriRef(useParams())
  const dispatch = useDispatch()
  const { url } = useRouteMatch()

  useEffect(() => {
      const ref = newQriRef({username: qriRef.username, name: qriRef.name, path: qriRef.path})
      dispatch(loadDataset(ref))
      dispatch(loadBody(ref))
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path])

  const menuItems:DatasetMenuItem[] = [
    { text: 'Dashboard', link: '/dashboard', icon: 'home'},
    { text: 'Collection', link: '/collection', icon: 'list'},
    { text: 'Activity Feed', link: '/activity', icon: 'bolt'},
  ]

  return (
    <div className='flex flex-col h-full' style={{ backgroundColor: '#F4F7FC'}}>
      <UserNavBar menuItems={menuItems}>
        <DatasetTitleMenu qriRef={qriRef} />
      </UserNavBar>
      <div className='flex flex-grow overflow-hidden relative'>
        <DatasetNavSidebar qriRef={qriRef} />
        <Switch>
          <Route path='/ds/:username/:name/workflow'><Workflow qriRef={qriRef} /></Route>
          <Route path='/ds/:username/:name' exact><Redirect to={`${url}/workflow`} /></Route>
          <Route path='/ds/:username/:name/components/:component'><DatasetComponents /></Route>
          <Route path='/ds/:username/:name/components'><Redirect to={`${url}/components/body`} /></Route>
          <Route path='/ds/:username/:name/history'><DatasetActivityFeed qriRef={qriRef} /></Route>
        </Switch>
        <DeployingScreen qriRef={qriRef} />
      </div>
    </div>
  )
}

export default Dataset;
