import React from 'react'
import { useDispatch } from 'react-redux'

import Button from '../../../chrome/Button'
import Dataset, { qriRefFromDataset } from '../../../qri/dataset'
import { AppDispatch } from '../../../store/api'
import { loadDatasetCommits } from '../../commits/state/commitActions'
import { saveDataset } from '../../dataset/state/editDatasetActions'

export interface SaveVersionButtonProps {
  dataset?: Dataset
}

const SaveVersionButton: React.FC<SaveVersionButtonProps> = ({
  dataset
}) => {
  const dispatch: AppDispatch = useDispatch()

  return (
    <Button
      className='bg-green'
      onClick={() => {
        if (dataset) {
          dispatch(saveDataset(dataset))
            .then(() => {
              dispatch(loadDatasetCommits(qriRefFromDataset(dataset)))
            })
        }
      }}
    >Save</Button>
  )
}

export default SaveVersionButton
