import React from 'react'
import { Link } from 'react-router-dom'

import Button from './Button'
import IconOnlyButton from './IconOnlyButton'

interface NewDatasetButtonProps {
  mini?: boolean
  id: string | undefined;
}

const NewDatasetButton: React.FC<NewDatasetButtonProps> = ({ mini,id }) => (
  <Link id={id} to={{
    pathname: `/workflow/new`,
    state: {
      showSplashModal: true,
      template: 'CSVDownload'
    }
  }}>
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
