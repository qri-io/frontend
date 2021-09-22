import React from 'react'

interface WorkflowHeaderProps {
  title: string
  onChange: (t: string) => void
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  title,
  onChange
}) => {
  return (
    <input
      className='w-full border-none outline-none'
      autoFocus
      value={title}
      onChange={(e) => onChange(e.target.value)}
      type='text'
    />
  )
}

export default WorkflowHeader
