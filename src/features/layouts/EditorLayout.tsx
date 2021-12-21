import React, { ReactFragment } from 'react'
import classNames from 'classnames'

import CommitBar from '../../chrome/CommitBar'

interface EditorLayoutProps {
  commitBarContent: JSX.Element | ReactFragment
  commitLoading: boolean
  commitTitle: string
  onCommitTitleChange: (d: string) => void
  onCommit: () => void
  showCommitBar: boolean
  // whether to show the Run now checkbox
  showRunNow?: boolean
  // the value of the Run now checkbox
  runNow?: boolean
  // fired when the Run now checkbox is changed
  onRunNowChange?: () => void
  // toggles scroller content (automationEditor) vs fixed-height content (datasetEditor)
  scroll?: boolean
  // whether the commit button is disabled
  commitDisabled?: boolean
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  commitBarContent,
  commitLoading,
  commitTitle,
  onCommitTitleChange,
  onCommit,
  showCommitBar,
  scroll,
  showRunNow,
  runNow = true,
  onRunNowChange = () => {},
  commitDisabled = false,
  children
}) => (
  /* top level div is a clone of DatasetFixedLayout, but we didn't use it because we need a different Header */
  <div className='flex flex-col flex-grow bg-qrigray-100 min-w-0' style={{ borderTopLeftRadius: 20 }}>
    <div className={classNames('flex flex-col flex-grow border-qritile-600 border-2', {
      'overflow-hidden': !scroll,
      'overflow-y-scroll': scroll
    })} style={{ borderTopLeftRadius: 20 }}>
      {children}
    </div>
    { showCommitBar &&
      <CommitBar
        commitBarContent={commitBarContent}
        commitLoading={commitLoading}
        commitTitle={commitTitle}
        onCommitTitleChange={onCommitTitleChange}
        onCommit={onCommit}
        showRunNow={showRunNow}
        runNow={runNow}
        onRunNowChange={onRunNowChange}
        disabled={commitDisabled}
      />
    }
  </div>
)

export default EditorLayout
