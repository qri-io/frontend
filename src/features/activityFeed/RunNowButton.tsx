import React from 'react'

import Button from '../../chrome/Button'
import { RunStatus } from '../../qri/run'

export interface RunNowButtonProps {
  status: RunStatus
  onClick: () => void
}

const RunNowButton: React.FC<RunNowButtonProps> = ({
  status,
  onClick
}) => {
  let text = 'Run Now'
  if (status === 'running') {
    text = 'Running'
  }
  return (
    <Button type='primary' icon={ status === 'running' ? 'loader' : 'play'} disabled={status === 'running'} onClick={onClick}>
      {text}
    </Button>
  )
}

export default RunNowButton
