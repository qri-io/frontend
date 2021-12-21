import React from 'react'
import { useDispatch } from "react-redux"

import Button from './Button'
import IconOnlyButton from './IconOnlyButton'
import { showModal } from "../features/app/state/appActions"
import { ModalType } from "../features/app/state/appState"

interface NewDatasetButtonProps {
  mini?: boolean
  id: string | undefined
}

const NewDatasetButton: React.FC<NewDatasetButtonProps> = ({ mini, id }) => {
  const dispatch = useDispatch()
  return (
    <>
      {
        !mini && (
          <Button id={id} onClick={() => dispatch(showModal(ModalType.newDataset))} type='secondary' icon='plus'>
            New Dataset
          </Button>
        )
      }
      {
        mini && (
          <IconOnlyButton id={id} onClick={() => dispatch(showModal(ModalType.newDataset))} type='secondary' size='lg' icon='plus' round />
        )
      }
    </>
  )
}

export default NewDatasetButton
