import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { JobList } from './features/job/JobList';
import DatasetList from './features/dataset/DatasetList';

export default function Routes () {
  return (
    <div className='route-content'>
      <Switch>
        <Route path='/datasets'><DatasetList /></Route>
        <Route path='/'><JobList /></Route>
      </Switch>
    </div>
  )
}
