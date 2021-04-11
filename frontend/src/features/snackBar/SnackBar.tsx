import React from 'react'
import ConnectionStatus from '../websocket/ConnectionStatus'

// import SnackBarMessage from './SnackBarMessage'

const SnackBar: React.FC<{}> = () => {
  // TODO(b5): build a reducer the snack bar, use it to show messages here
  // TODO(b5): actions for dismissing snack bar messages
  return (<div className="absolute bottom-0 right-0 py-4 pl-4">
    <ConnectionStatus />
  </div>)
}

export default SnackBar
