import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button, { ButtonType } from '../../chrome/Button'
import Icon from '../../chrome/Icon'
import IconLink from '../../chrome/IconLink'
import { QriRef } from '../../qri/ref'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import { selectSessionUser } from '../session/state/sessionState'
import { downloadLinkFromQriRef } from '../dataset/state/datasetActions'

export interface DownloadDatasetButtonProps {
  qriRef: QriRef
  // if small=true, the component will render a Button with an icon instead of text
  small?: boolean
  type?: ButtonType
  // if asIconLink=true, the component will render an IconLink instead of a Button
  // useful for showing a download link in BodyHeader
  asIconLink?: boolean
  // if body=true, the downloadLink will get the dataset body
  body?: boolean
}

const DownloadDatasetButton: React.FC<DownloadDatasetButtonProps> = ({
  qriRef,
  asIconLink=false,
  body=false,
  small=false
}) => {
  const dispatch = useDispatch()

  const user = useSelector(selectSessionUser)

  const handleDownloadClick = () => {
    dispatch(showModal(ModalType.logIn))
  }

  const downloadLink = downloadLinkFromQriRef(qriRef, body)

  // returns <IconLink>
  if (asIconLink) {
    if (user.username === 'new') {
      return <IconLink icon='download' onClick={handleDownloadClick} />
    } else {
      return <IconLink icon='download' link={downloadLink} />
    }
  } else { // returns <Button>
    let buttonContent = (
      <Button type='primary-outline' size='sm' className='px-1.5'>
        {small ? <Icon icon='download' /> : 'Download'}
      </Button>
    )

    if (user.username === 'new') {
      return (
        <div onClick={handleDownloadClick}>
          {buttonContent}
        </div>
      )
    }

    return (
      <a href={downloadLink}>
        {buttonContent}
      </a>
    )
  }
}

export default DownloadDatasetButton
