import React from 'react'
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router'

import WorkflowPage from '../workflow/WorkflowPage'
import DatasetComponents from '../dsComponents/DatasetComponents'
import DatasetActivityFeed from '../activityFeed/DatasetActivityFeed'
import DatasetPreviewPage from '../dsPreview/DatasetPreviewPage'
import DatasetIssues from '../issues/DatasetIssues'
import DatasetPage from './DatasetPage'
import { newQriRef } from '../../qri/ref'
import DatasetEditor from '../dsComponents/DatasetEditor'

const DatasetRoutes: React.FC<{}> = () => {
  const { url } = useRouteMatch()
  // TODO(b5): this qriRef is missing all params after /:username/:name b/c
  // params are dictated by the route that loaded this component.
  // This ref can only be used to load HEAD because DatasetRoutes defines
  // params like :fs and :hash, which are used to construct a commit-specific
  // ref. Move all ref constructino into container components to avoid potential
  // bugs
  const qriRef = newQriRef(useParams())

  return (
    <Switch>
      <Route path='/ds/:username/:name' exact>
        <Redirect to={`${url}/preview`} />
      </Route>

      <Route path='/ds/:username/:name/workflow'>
        <WorkflowPage qriRef={qriRef} />
      </Route>
      <Route path='/ds/:username/:name/history'>
        <DatasetPage>
          <DatasetActivityFeed qriRef={qriRef} />
        </DatasetPage>
      </Route>
      <Route path='/ds/:username/:name/preview' exact>
        <DatasetPreviewPage qriRef={qriRef} />
      </Route>
      {process.env.REACT_APP_FEATURE_WIREFRAMES &&
        <Route path='/ds/:username/:name/issues'>
          <DatasetPage>
            <DatasetIssues qriRef={qriRef} />
          </DatasetPage>
        </Route>
      }
      {process.env.REACT_APP_FEATURE_WIREFRAMES &&
        <Route path='/ds/:username/:name/edit'>
          <DatasetPage>
            <DatasetEditor />
          </DatasetPage>
        </Route>
      }

      <Route path='/ds/:username/:name/at/:fs/:hash/components'>
        <Redirect to={`/ds/${qriRef.username}/${qriRef.name}/at/${qriRef.path}/body`} />
      </Route>
      <Route path='/ds/:username/:name/at/:fs/:hash/:component'>
        <DatasetPage>
          <DatasetComponents />
        </DatasetPage>
      </Route>
      <Route path='/ds/:username/:name/components'>
        <Redirect to={`/ds/${qriRef.username}/${qriRef.name}/body`} />
      </Route>
      <Route path='/ds/:username/:name/:component'>
        <DatasetPage>
          <DatasetComponents />
        </DatasetPage>
      </Route>
    </Switch>
  )
}

export default DatasetRoutes
