import React from 'react'
import { Link } from 'react-router-dom'

import Button from './Button'
import IconOnlyButton from './IconOnlyButton'
import { trackGoal } from '../features/analytics/analytics'

interface NewDatasetButtonProps {
  mini?: boolean
  id: string | undefined;
}

const NewDatasetButton: React.FC<NewDatasetButtonProps> = ({ mini,id }) => (
  <Link
    id={id}
    to={{
      pathname: `/workflow/new`,
      state: {
        showSplashModal: true,
        template: 'CSVDownload'
      }
    }}
    onClick={() => {
      // general-click-new-dataset-button event
      trackGoal('KHBCRTHJ', 0)
    }}
  >
    {
      !mini && (
        <Button type='secondary' icon='plus'>
          New Dataset
        </Button>
      )
    }
    {
      mini && (
        <IconOnlyButton type='secondary' size='lg' icon='plus' round />
      )
    }

  </Link>
)

export default NewDatasetButton
