import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router';

import { newQriRef } from '../../qri/ref';
import HistoryList from '../history/HistoryList';
import WorkflowEditor from '../workflow/WorkflowEditor';
import DatasetComponents from './DatasetComponents';
import DatasetHeader from './DatasetHeader';
import { loadDataset } from './state/datasetActions'
import { useParams } from 'react-router-dom';

const Dataset: React.FC<any> = () => {
  const ref = newQriRef(useParams())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadDataset(ref))
  }, [dispatch, ref])

  return (
    <div>
      <DatasetHeader qriRef={ref} />
      <Switch>
        <Route path='/ds/:username/:dataset' exact><WorkflowEditor /></Route>
        <Route path='/ds/:username/:dataset/components'><DatasetComponents /></Route>
        <Route path='/ds/:username/:dataset/history'><HistoryList /></Route>
      </Switch>
    </div>
  )
}

export default Dataset;
