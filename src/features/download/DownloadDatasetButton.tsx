import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button, { ButtonType } from '../../chrome/Button'
import IconLink from '../../chrome/IconLink'
import { QriRef } from '../../qri/ref'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import { selectSessionUser } from '../session/state/sessionState'
import { downloadLinkFromQriRef } from '../dataset/state/datasetActions'
import { trackGoal } from '../../features/analytics/analytics'

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
  hideIcon?: boolean
  title?: string
}

const DownloadDatasetButton: React.FC<DownloadDatasetButtonProps> = ({
  qriRef,
  small = false,
  type = 'primary-outline',
  asIconLink = false,
  body = true,
  hideIcon = false,
  title
}) => {
  const dispatch = useDispatch()

  const user = useSelector(selectSessionUser)

  const handleDownloadClick = () => {
    // anonymous-click-download event
    trackGoal('06WN7WD1', 0)
    dispatch(showModal(ModalType.logIn))
  }

  const downloadLink = downloadLinkFromQriRef(qriRef, body)

  // returns <IconLink>
  if (asIconLink) {
    if (user.username === 'new') {
      return <IconLink title={title} icon='download' onClick={handleDownloadClick} />
    } else {
      return <IconLink title={title} icon='download' to={downloadLink} onClick={() => {
        // preview-download-body
        trackGoal('MUBGTLL9', 0)
      }} />
    }
  } else { // returns <Button>
    let buttonContent = (
      <Button type={type} icon={hideIcon ? '' : 'download'} className='flex-shrink-0'>
        {!small && 'Download'}
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
      <a href={downloadLink} title={title} onClick={() => {
        // preview-download-full-dataset event
        trackGoal('GGER8NHQ', 0)
      }}>
        {buttonContent}
      </a>
    )
  }
}

export default DownloadDatasetButton
