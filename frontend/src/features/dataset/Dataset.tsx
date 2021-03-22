import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
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
import { selectSessionUser } from '../session/state/sessionState';
import { selectSessionUserCanEditDataset } from './state/datasetState';

export interface DatasetMenuItem {
  text: string
  link: string
  icon?: string
}

export interface DatasetProps {
  isNew?: boolean
}

const Dataset: React.FC<DatasetProps> = ({ isNew = false }) => {
  const qriRef = newQriRef(useParams())
  const user = useSelector(selectSessionUser)
  const editable = useSelector(selectSessionUserCanEditDataset)
  const dispatch = useDispatch()
  const { url } = useRouteMatch()

  // This covers the case where a user created a new workflow before logging in.
  // If they login while working on the workflow, the `user` will change, but the
  // params used to generate the `qriRef` will not (because they are generated
  // from the url, which has not changed). This check ensures that the correct 
  // username is propagated after login/signup.
  if (qriRef.username === 'new') {
    qriRef.username = user.username
  }

  useEffect(() => {
    if (isNew) { return }

    const ref = newQriRef({username: qriRef.username, name: qriRef.name, path: qriRef.path})
    dispatch(loadDataset(ref))
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path, isNew])

  const menuItems:DatasetMenuItem[] = [
    { text: 'Dashboard', link: '/dashboard', icon: 'home'},
    { text: 'Collection', link: '/collection', icon: 'list'},
    { text: 'Activity Feed', link: '/activity', icon: 'bolt'},
  ]

  return (
    <div className='flex flex-col h-full' style={{ backgroundColor: '#F4F7FC'}}>
      <NavBar menuItems={menuItems}>
        <DatasetTitleMenu qriRef={qriRef} editable={editable} />
      </NavBar>
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
