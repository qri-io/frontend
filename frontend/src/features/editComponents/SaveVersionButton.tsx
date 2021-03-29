import React from 'react'
import { useDispatch } from 'react-redux'

import Button from '../../chrome/Button'
import Dataset from '../../qri/dataset'
import { saveDataset } from './state/editDatasetActions'

export interface SaveVersionButtonProps {
  dataset?: Dataset
}

const SaveVersionButton: React.FC<SaveVersionButtonProps> = ({
  dataset
}) => {
  const dispatch = useDispatch()

  return (
    <Button 
      className='bg-green'
      onClick={() => {
        if (dataset) {
          dispatch(saveDataset(dataset))
        }
      }}
    >Save</Button>
  )
}

export default SaveVersionButton
