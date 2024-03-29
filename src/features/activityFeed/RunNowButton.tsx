import React from 'react'
import ReactTooltip from 'react-tooltip'

import Button from '../../chrome/Button'
import { RunStatus } from '../../qri/run'

export interface RunNowButtonProps {
  status: RunStatus
  onClick: () => void
  onCancel: () => void
  isDatasetOwner: boolean
}

const RunNowButton: React.FC<RunNowButtonProps> = ({
  status,
  onClick,
  onCancel,
  isDatasetOwner
}) => {
  let text = 'Run Now'
  if (status === 'running') {
    text = 'Cancel'
  }

  return (
    <div data-tip={isDatasetOwner ? '' : 'Only the dataset owner can trigger a run'}>
      <Button type='primary' icon={ status === 'running' ? 'loader' : 'play'} disabled={!isDatasetOwner || status === 'running'} onClick={status === 'running' ? onCancel : onClick}>
        {text}
      </Button>
      <ReactTooltip/>
    </div>
  )
}

export default RunNowButton
