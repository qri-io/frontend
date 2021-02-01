import React from 'react'

import { RunState } from '../../qrimatic/run'
import RunStateIcon from './RunStateIcon'

export interface RunBarProps {
 status: RunState,
 onRun: () => void,
 onRunCancel: () => void,
}

const RunBar: React.FC<RunBarProps> = ({
  status,
  onRun,
  onRunCancel
}) => {

  // TODO (ramfox): when we get the ability to switch between "dry run" and "run and save"
  // we need to switch on `runButtonType` and set `setRunButtonType`
  // const dispatch = useDispatch()
  // const runButtonType = useSelector(selectRunButtonType)
  // const handleSwitchButtonTypes = (runType: RunType) => {
  //   dispatch(setRunButtonType(runType))
  //   dispatch(clearRun())
  // }
  return (<div className=''>
    <div className='flex'>
      <div className='flex-2 mr-2'>
        <div className='inline-block align-middle'>
          <RunStateIcon state={status} size='md' />
        </div>
      </div>
      <div className='flex-1 text-right'>
        <button
          className='w-40 py-1 px-4 mx-1 font-semibold shadow-md text-white bg-gray-600 hover:bg-gray-500 rounded'
          onClick={() => {(status === RunState.running) ? onRunCancel() : onRun() }}
        >{(status === RunState.running) ? 'Cancel' : 'Dry Run' }</button>
      </div>
    </div>
  </div>)
}

export default RunBar
