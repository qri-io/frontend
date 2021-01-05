import React from 'react'
import { Switch, Route } from 'react-router-dom'

import JobList from './features/job/JobList';
import DatasetList from './features/dataset/DatasetList';
import TemplateList from './features/template/TemplateList';
import DatasetEditor from './features/editor/DatasetEditor';
import ChangeReport from './features/changes/ChangeReport';
import NotificationList from './features/notification/NotificationList';
import Login from './features/session/Login';
import Signup from './features/session/Signup';
import Splash from './features/splash/Splash';
import ForgotPassword from './features/session/ForgotPassword';
import Run from './features/run/Run';

export default function Routes () {
  return (
    <div className='route-content'>
      <Switch>
        <Route path='/login'><Login /></Route>
        <Route path='/signup'><Signup /></Route>
        <Route path='/login/forgot'><ForgotPassword /></Route>

        <Route path='/datasets/edit'><DatasetEditor /></Route>
        <Route path='/datasets/new'><TemplateList /></Route>
        <Route path='/datasets'><DatasetList /></Route>

        <Route path='/run'><Run /></Route>

        <Route path='/jobs'><JobList /></Route>

        <Route path='/changes'><ChangeReport /></Route>

        <Route path='/notifications'><NotificationList /></Route>

        <Route path='/'><Splash /></Route>
      </Switch>
    </div>
  )
}
