import React from 'react'

import Button from '../../chrome/Button'
import Icon from '../../chrome/Icon'
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
    <Button type='primary' disabled={status === 'running'} onClick={onClick}>
      <Icon icon={ status === 'running' ? 'loader' : 'play'} className='mr-2'/>
      {text}
    </Button>
  )
}

export default RunNowButton
