import React from 'react'
import EditableLabel from '../../chrome/EditableLabel'
import { QriRef } from '../../qri/ref'
import { RunState } from '../../qrimatic/run'
import RunStateIcon from './RunStateIcon'

export interface RunBarProps {
  qriRef: QriRef,
  status: RunState,
  onRun: () => void,
  onRunCancel: () => void,
  onDeploy: () => void,
  onDeployCancel: () => void,
  onRename: (name: string) => void,
}

const RunBar: React.FC<RunBarProps> = ({
  qriRef,
  status,
  onRun,
  onRunCancel,
  onDeploy,
  onDeployCancel,
  onRename,
}) => (
  <div className='pt-4 sticky top-0' style={{
    background: 'linear-gradient(rgb(255, 255, 255) 10%, rgba(255, 255, 255, 0))'
  }}>
    <div className='flex bg-gray-100 rounded border border-gray-200'>
      <div className='flex-2'>
        <p>{qriRef.username}/</p>
        <EditableLabel name='name' size='xl' value={qriRef.name} onChange={(name: string, value: string) => { onRename(value) }} />
        <p><RunStateIcon state={status} /></p>
      </div>
      <div className='flex-1 text-right'>
        <button
          className='py-1 px-4 mx-1 font-semibold shadow-md text-white bg-gray-600 hover:bg-gray-300 rounded'
          onClick={() => {(status === RunState.running) ? onRunCancel() : onRun() }}
        >{(status === RunState.running) ? 'Cancel' : 'Dry Run' }</button>
      </div>
    </div>
  </div>
)

export default RunBar
