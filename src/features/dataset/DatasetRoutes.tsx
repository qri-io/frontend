import React from 'react'
import { Route, Switch, useParams } from 'react-router'
import { useLocation } from 'react-router-dom'

import ExistingAutomationEditor from '../workflow/ExistingAutomationEditor'
import DatasetComponents from '../dsComponents/DatasetComponents'
import DatasetActivityFeed from '../activityFeed/DatasetActivityFeed'
import DatasetPreviewPage from '../dsPreview/DatasetPreviewPage'
import DatasetIssues from '../issues/DatasetIssues'
import { newQriRef } from '../../qri/ref'
import DatasetWrapper from '../dsComponents/DatasetWrapper'
import { PrivateRoute } from '../../routes'
import ExistingDatasetEditor from "../../features/datasetEditor/ExistingDatasetEditor"

const DatasetRoutes: React.FC<{}> = () => {
  // TODO(b5): this qriRef is missing all params after /:username/:name b/c
  // params are dictated by the route that loaded this component.
  // This ref can only be used to load HEAD because DatasetRoutes defines
  // params like :fs and :hash, which are used to construct a commit-specific
  // ref. Move all ref constructino into container components to avoid potential
  // bugs
  const qriRef = newQriRef(useParams())
  const { pathname } = useLocation()
  const isEditor = pathname.includes('/edit')

  return (
    <DatasetWrapper qriRef={qriRef} editor={isEditor}>
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
        <PrivateRoute path='/:username/:name/automation'>
          <ExistingAutomationEditor qriRef={qriRef} />
        </PrivateRoute>

        {/* dataset runs */}
        <Route path='/:username/:name/runs'>
          <DatasetActivityFeed qriRef={qriRef} />
        </Route>

        <Route path='/:username/:name/edit'>
          <ExistingDatasetEditor />
        </Route>

        {process.env.REACT_APP_FEATURE_WIREFRAMES &&
          <Route path='/:username/:name/issues'>
            <DatasetIssues qriRef={qriRef} />
          </Route>
        }

      </Switch>
    </DatasetWrapper>
  )
}

export default DatasetRoutes
