import React, { useState } from 'react'

export interface EditableLabelProps {
  name: string
  value: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onChange: (name: string, value: string) => void
}

const EditableLabel: React.FC<EditableLabelProps> = ({
  name,
  value,
  size = 'md',
  onChange
}) => {
  const [editing, setEditing] = useState(false)

  // TODO (b5) - double-clicking doesn't focus the newly created input element.
  // it should. Might need to "useRef" for this sort of thing
  const handleDoubleClick = () => {
    editing ? handleClose() : setEditing(true)
  }
  const handleClose = () => {
    onChange(name, value)
    setEditing(false)
  }

  return (
    <span>
      {!editing && <h3 onDoubleClick={handleDoubleClick}>{value}</h3>}
      {editing &&  <input type='text' value={value} onChange={(e: any)=>{ onChange(name, e.target.value)}} onBlur={handleClose} />}
    </span>
  )
}

export default EditableLabel
