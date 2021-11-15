// All dataset routes share DatasetWrapper, which handles the rendering of the
// dataset menu and fetches dsPreview (the latest version of the dataset)
// All routes use dsPreview to render the dataset header, so it is always needed
// regardless of th other dataset content being displayed

// DatasetPreviewPage fetches the other necessary parts of the preview (body + readme)

import React, { useEffect } from 'react'
import { Route, Switch, useParams } from 'react-router'
import { useDispatch } from "react-redux"

import WorkflowPage from '../workflow/WorkflowPage'
import DatasetComponents from '../dsComponents/DatasetComponents'
import DatasetActivityFeed from '../activityFeed/DatasetActivityFeed'
import DatasetPreviewPage from '../dsPreview/DatasetPreviewPage'
import DatasetIssues from '../issues/DatasetIssues'
import { newQriRef } from '../../qri/ref'
import DatasetEditor from '../dsComponents/DatasetEditor'
import DatasetWrapper from '../dsComponents/DatasetWrapper'
import { loadDataset, loadHeader } from "./state/datasetActions"
import { PrivateRoute } from '../../routes'

const DatasetRoutes: React.FC<{}> = () => {
  // TODO(b5): this qriRef is missing all params after /:username/:name b/c
  // params are dictated by the route that loaded this component.
  // This ref can only be used to load HEAD because DatasetRoutes defines
  // params like :fs and :hash, which are used to construct a commit-specific
  // ref. Move all ref constructino into container components to avoid potential
  // bugs
  const qriRef = newQriRef(useParams())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadHeader({ username: qriRef.username, name: qriRef.name, path: qriRef.path }))
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path])
  useEffect(() => {
    dispatch(loadDataset(qriRef))
  }, [dispatch, qriRef.username, qriRef.name])

  return (
    <DatasetWrapper>
      <Switch>
        {/* dataset preview */}
        <Route path='/:username/:name' exact>
          <DatasetPreviewPage qriRef={qriRef} />
        </Route>

        <Route path='/:username/:name/at/:fs/:hash' exact>
          <DatasetPreviewPage qriRef={qriRef} />
        </Route>

        {/* dataset history */}
        <Route path='/:username/:name/history'>
          <DatasetComponents />
        </Route>

        <Route path='/:username/:name/at/:fs/:hash/history'>
          <DatasetComponents />
        </Route>

        {/* dataset workflow */}
        <PrivateRoute path='/:username/:name/workflow'>
          <WorkflowPage qriRef={qriRef} />
        </PrivateRoute>

        {/* dataset runs */}
        <Route path='/:username/:name/runs'>
          <DatasetActivityFeed qriRef={qriRef} />
        </Route>

        {process.env.REACT_APP_FEATURE_WIREFRAMES &&
          <Route path='/:username/:name/issues'>
            <DatasetIssues qriRef={qriRef} />
          </Route>
        }

        {process.env.REACT_APP_FEATURE_WIREFRAMES &&
          <PrivateRoute path='/:username/:name/edit'>
            <DatasetEditor />
          </PrivateRoute>
        }

      </Switch>
    </DatasetWrapper>
  )
}

export default DatasetRoutes
