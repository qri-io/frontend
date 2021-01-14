import React from 'react'
import { Switch, Route } from 'react-router-dom'

import JobList from './features/job/JobList';
import TemplateList from './features/template/TemplateList';
import ChangeReport from './features/changes/ChangeReport';
import NotificationList from './features/notification/NotificationList';
import NotificationSettings from './features/notification/NotificationSettings';
import Login from './features/session/Login';
import Signup from './features/session/Signup';
import Splash from './features/splash/Splash';
import ForgotPassword from './features/session/ForgotPassword';
import Run from './features/run/Run';
import Collection from './features/collection/Collection';
import Dataset from './features/dataset/Dataset';

export default function Routes () {
  return (
    <div className='route-content'>
      <Switch>
        <Route path='/login'><Login /></Route>
        <Route path='/signup'><Signup /></Route>
        <Route path='/login/forgot'><ForgotPassword /></Route>

        <Route path='/collection'><Collection /></Route>

        <Route path='/ds/new'><TemplateList /></Route>
        <Route path='/ds/:username/:name'><Dataset /></Route>

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
