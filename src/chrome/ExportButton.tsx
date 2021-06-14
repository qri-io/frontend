import React from 'react'
import { RouteProps } from 'react-router-dom'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

import { QriRef } from '../qri/ref'
// import { Modal, ModalType } from '../../../models/modals'
// import { setModal } from '../../../actions/ui'
import ActionButton from './ActionButton'

interface ExportButtonProps extends RouteProps {
  qriRef: QriRef
  showIcon: boolean
  // setModal: (modal: Modal) => void
  size: 'sm' | 'md'
}

/**
 *  If there is a dataset selected & we are at a particular verison, show the
 *  `ExportButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
const ExportButton: React.FC<ExportButtonProps> = ({
  qriRef,
  showIcon = true,
  size = 'md',
  // setModal
}) => (<ActionButton
  id='export-button'
  label={'Export'}
  tooltip='Export this verison of the dataset to your filesystem'
  icon={showIcon && faDownload}
  size={size}
  onClick={() => {
    // setModal({ type: ModalType.ExportDataset, version: qriRef })
    alert('export this dataset!')
  }}
/>)

export default ExportButton
