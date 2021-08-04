import React from 'react'

import Icon from '../../chrome/Icon'

interface WarningDialogProps {
  text: string
}

const WarningDialog: React.FC<WarningDialogProps> = ({ text }) => (
  <div className='flex-shrink-0 text-qrigray-400 text-xs border-2 border-warningyellow rounded mt-5 mb-5 py-1.5 px-2 leading-tight flex'>
    <div className='mr-2 text-warningyellow'><Icon icon='circleWarning' size='sm'/></div>
    <div>{text}</div>
  </div>
)

export default WarningDialog
