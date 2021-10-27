import React from 'react'

import Button from '../../chrome/Button'
import { RunStatus } from '../../qri/run'

export interface RunNowButtonProps {
  status: RunStatus
  onClick: () => void
  onCancel: () => void
}

const RunNowButton: React.FC<RunNowButtonProps> = ({
  status,
  onClick,
  onCancel
}) => {
  let text = 'Run Now'
  if (status === 'running') {
    text = 'Cancel'
  }

  return (
    <Button type='primary' icon={ status === 'running' ? 'loader' : 'play'} disabled={status === 'running'} onClick={status === 'running' ? onCancel : onClick}>
      {text}
    </Button>
  )
}

export default RunNowButton
