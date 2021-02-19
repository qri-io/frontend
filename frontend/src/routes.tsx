import React from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

import JobList from './features/job/JobList';
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
import { selectSessionUser } from './features/session/state/sessionState'

const PrivateRoute: React.FC<any>  = ({ path, children }) => {
  const user = useSelector(selectSessionUser)
  return (
    <Route path={path}>
      { user ? <>{children}</> : <Redirect to={{ pathname: '/splash' }} /> }
    </Route>
  )
}


export default function Routes () {

  return (
    <div className='route-content h-full w-full'>
      <Switch>
        <Route path='/login'><Login /></Route>
        <Route path='/signup'><Signup /></Route>
        <Route path='/login/forgot'><ForgotPassword /></Route>

        <PrivateRoute path='/dashboard'><Dashboard /></PrivateRoute>
        <PrivateRoute path='/collection'><Collection /></PrivateRoute>
        <PrivateRoute path='/activity'><CollectionActivityFeed /></PrivateRoute>

        <PrivateRoute path='/ds/new'><TemplateList /></PrivateRoute>
        <PrivateRoute path='/ds/:username/:name'><Dataset /></PrivateRoute>

        <Route path='/run'><Run /></Route>
        <Route path='/jobs'><JobList /></Route>
        <Route path='/changes'><ChangeReport /></Route>

        <Route path='/notifications'><NotificationList /></Route>
        <Route path='/notification_settings'><NotificationSettings /></Route>

        <Route path='/'><Splash /></Route>
      </Switch>
    </div>
  )
}
