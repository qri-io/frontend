import React from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

import TemplateList from './features/template/TemplateList';
import ChangeReport from './features/changes/ChangeReport';
import CollectionActivityFeed from './features/activityFeed/CollectionActivityFeed';
import NotificationList from './features/notification/NotificationList';
import NotificationSettings from './features/notification/NotificationSettings';
import Login from './features/session/Login';
import Signup from './features/session/Signup';
import Splash from './features/splash/Splash';
import ForgotPassword from './features/session/ForgotPassword';
import Run from './features/run/Run';
import Collection from './features/collection/Collection';
import Dashboard from './features/dashboard/Dashboard';
import Dataset from './features/dataset/Dataset';
import { NewUser, selectSessionUser } from './features/session/state/sessionState'

const PrivateRoute: React.FC<any>  = ({ path, children }) => {
  const user = useSelector(selectSessionUser)
  return (
    <Route path={path}>
      { user !== NewUser ? <>{children}</> : <Redirect to={{ pathname: '/splash' }} /> }
    </Route>
  )
}


export default function Routes () {
  const user = useSelector(selectSessionUser)

  return (
    <div className='route-content h-full w-full'>
      <Switch>
        <Route path='/login'><Login /></Route>
        <Route path='/signup'><Signup /></Route>
        <Route path='/login/forgot'><ForgotPassword /></Route>

        <PrivateRoute path='/dashboard'><Dashboard /></PrivateRoute>
        <PrivateRoute path='/collection'><Collection /></PrivateRoute>
        <PrivateRoute path='/activity'><CollectionActivityFeed /></PrivateRoute>

        <Route path='/ds/new/:name'><Dataset /></Route>
        <Route path='/ds/new'><TemplateList /></Route>
        <Route path='/ds/:username/:name'><Dataset /></Route>

        <Route path='/run'><Run /></Route>
        <Route path='/changes'><ChangeReport /></Route>

        <Route path='/notifications'><NotificationList /></Route>
        <Route path='/notification_settings'><NotificationSettings /></Route>

        <Route path='/'>
          {
            user !== NewUser ? <Redirect to='/dashboard' /> : <Splash />
          }
        </Route>
      </Switch>
    </div>
  )
}
