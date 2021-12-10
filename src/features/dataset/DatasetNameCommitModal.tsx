// this component contains a the modal for editing a dataset's title and creating a commit for the change
// we are going to deprecate it in favor of the meta editor, but we may want to bring it back someday

import React, { useCallback, useState } from 'react'
import classNames from "classnames"
import { useDispatch, useSelector } from 'react-redux'

import {
  commitDatasetTitle,
  loadDataset,
  resetDatasetTitleError
} from './state/datasetActions'

import { clearModal, showModal } from "../app/state/appActions"
import { ModalType, selectNavExpanded } from "../app/state/appState"
import { QriRef, newQriRef } from "../../qri/ref"
import { loadDatasetCommits } from "../commits/state/commitActions"

export interface DatasetHeaderLayoutProps {
  qriRef: QriRef
  title: string
}

const DatasetHeaderLayout: React.FC<DatasetHeaderLayoutProps> = ({
  qriRef,
  title,
  children
}) => {
  const dispatch = useDispatch()
  const [ titleChangePosition, setTitleModalPosition ] = useState({ top: '0', left: '0' })

  const isExpanded = useSelector(selectNavExpanded)

  const onTitleClick = () => {
    dispatch(resetDatasetTitleError())
    dispatch(showModal(ModalType.editDatasetTitle, {
      title,
      onCommit: handleTitleChange
    }, true, { top: titleChangePosition.top.toString(), left: titleChangePosition.left.toString(), position: 'absolute' }))
  }

  const handleTitleChange = (title: string, commitTitle: string) => {
    commitDatasetTitle(qriRef, title, commitTitle)(dispatch)
      .then(({ type }) => {
        if (type === 'API_TITLE_SUCCESS') {
          const ref = newQriRef({ username: qriRef.username, name: qriRef.name })
          loadDataset(ref)(dispatch).then(({ type }) => {
            if (type === 'API_DATASET_SUCCESS') {
              dispatch(clearModal())
            }
          })
          dispatch(loadDatasetCommits(ref))
        }
      })
  }

  const measuredRef = useCallback(node => {
    if (node !== null) {
      const left: string = `${node.getBoundingClientRect().left - 25.5}px`
      const top: string = `${node.getBoundingClientRect().top - 55.5}px`
      setTitleModalPosition({ top, left })
    }
  }, [ isExpanded ])

  return (
    <div ref={measuredRef} onClick={onTitleClick} className={classNames({ 'cursor-pointer': true }, 'flex items-center group hover:text')}>
      {children}
    </div>
  )
}

export default DatasetHeaderLayout
