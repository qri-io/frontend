import React from 'react'
import { useDispatch } from 'react-redux'

import Button from '../../../chrome/Button'
import Dataset, { qriRefFromDataset } from '../../../qri/dataset'
import { loadDatasetCommits } from '../../commits/state/commitActions'
import { saveDataset } from '../../dataset/state/editDatasetActions'

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
          saveDataset(dataset)(dispatch)
            .then(() => {
              dispatch(loadDatasetCommits(qriRefFromDataset(dataset)))
            })
        }
      }}
    >Save</Button>
  )
}

export default SaveVersionButton
