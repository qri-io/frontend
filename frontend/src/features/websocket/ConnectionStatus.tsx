import React from 'react'
import { useSelector } from 'react-redux'
import StatusDot from '../../chrome/StatusDot'
import { ComponentStatus } from '../../qri/dataset'
import { selectWebsocketState, WSConnectionStatus } from './state/websocketState'

const ConnectionStatus: React.FC<{}> = () => {
  const state = useSelector(selectWebsocketState)

  if (state.status === WSConnectionStatus.connected) {
    return null
  }

  return (
    <div className='flex'>
      <div className='mt-1'>
        <StatusDot showNoChanges status={componentStatusFromWSConnectionStatus(state.status)} />
      </div>
      <div className='ml-2'>
        {(() => {
          switch (state.status) {
            case WSConnectionStatus.disconnected:
              return "Disconnected"
            // case WSConnectionStatus.connected:
            //   return "Connected"
            case WSConnectionStatus.connecting:
              return "Connecting"
            case WSConnectionStatus.interrupted:
              return "Reconnecting..."
            default: 
              return null
          }
        })()}
      </div>
    </div>
  )
}

export default ConnectionStatus

function componentStatusFromWSConnectionStatus(s: WSConnectionStatus): ComponentStatus {
  switch (s) {
    case WSConnectionStatus.disconnected:
      return 'removed'
    case WSConnectionStatus.connected:
      return 'added'
    case WSConnectionStatus.connecting:
      return 'modified'
    case WSConnectionStatus.interrupted:
      return 'removed'
    default:
      return 'unmodified'
  }
}
