import React, { ReactFragment } from 'react'

import Spinner from "./Spinner"
import TextInput from "./forms/TextInput"
import Button from "./Button"
import Checkbox from "./forms/Checkbox"

interface CommitBarProps {
  // used for the message displayed on the left side of the bar
  commitBarContent: JSX.Element | ReactFragment
  // shows a spinner in the commit button
  commitLoading: boolean
  // value for the commit title input
  commitTitle: string
  // fired when the title input is edited
  onCommitTitleChange: (d: string) => void
  // fired when the commit button is clicked
  onCommit: () => void
  // whether to show the Run now checkbox
  showRunNow?: boolean
  // the value of the Run now checkbox
  runNow?: boolean
  // fired when the Run now checkbox is changed
  onRunNowChange?: () => void
  // whether the button is disabled
  disabled?: boolean
}

const CommitBar: React.FC<CommitBarProps> = ({
  commitBarContent,
  commitLoading,
  commitTitle,
  onCommitTitleChange,
  onCommit,
  showRunNow,
  runNow = true,
  onRunNowChange = () => {},
  disabled
}) => (
  <div className='relative animate-flyUp flex items-center justify-between w-full bg-qrigray-1000 py-1 px-3'>
    <p className='text-sm text-white'>{commitBarContent}</p>
    <div className='flex items-center'>
      { showRunNow && (
      <div className='text-white flex items-center mr-6'>
        <div className='mr-2'>
          <Checkbox value={runNow} onChange={onRunNowChange}/>
        </div>
        <div>Run now</div>
      </div>
      )}

      <TextInput
        onChange={(value: string) => onCommitTitleChange(value)}
        className='mr-3 w-80'
        inputClassName='p-4'
        name='title'
        value={commitTitle}
        size='sm'
        placeholder='commit message'
      />
      <Button onClick={onCommit} style={{ height: '32px' }} icon='commit' size='sm' type="secondary" disabled={disabled}>
        {commitLoading ? <Spinner color='#fff' size={6} /> : 'Commit'}
      </Button>
    </div>
  </div>
)

export default CommitBar
