import React from 'react'
import { Link } from 'react-router-dom'

import Icon from './Icon'
import Button from './Button'

interface NewDatasetButtonProps {
  mini: boolean
}

const NewDatasetButton: React.FC<NewDatasetButtonProps> = ({ mini }) => (
  <Link to={{
    pathname: `/workflow/new`,
    state: {
      showSplashModal: true,
      template: 'CSVDownload'
    }
  }}>
    {
      !mini && (
        <Button type='secondary'>
          <Icon icon='plus' className='mr-2'/>
          New Dataset
        </Button>
      )
    }
    {
      mini && (
        <div
          className='text-white bg-qripink hover:bg-qripink-600 inline-block p-8 relative'
          style={{
            borderRadius: 50
          }}
        >
          <Icon icon='plus' size='lg' className='absolute left-5 top-5'/>
        </div>
      )
    }

  </Link>
)

export default NewDatasetButton
