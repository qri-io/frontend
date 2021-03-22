import classNames from 'classnames'
import React, { useState } from 'react'

export interface EditableLabelProps {
  name: string
  value: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  readOnly?: boolean
  onChange: (name: string, value: string) => void
}

const EditableLabel: React.FC<EditableLabelProps> = ({
  name,
  value,
  size = 'md',
  readOnly = false,
  onChange
}) => {
  const [editing, setEditing] = useState(false)
  const [edit, setEdit] = useState(value)

  // TODO (b5) - double-clicking doesn't focus the newly created input element.
  // it should. Might need to "useRef" for this sort of thing
  const handleLabelClick = () => {
    if (readOnly) { return }
    editing ? handleClose() : setEditing(true)
  }
  const handleClose = () => {
    onChange(name, edit)
    setEditing(false)
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        onChange(name, edit)
        setEditing(false)
        break
      case 'Escape':
        e.preventDefault()
        onChange(name, value)
        setEditing(false)
        break
    }
  }

  return (editing
    ? <input
        type='text'
        className='bg-transparent w-max'
        value={edit}
        onKeyPress={handleKeyPress}
        onChange={(e: any)=>{setEdit(e.target.value)}}
        onBlur={handleClose}
      />
    : <h3 className={classNames({ 'cursor-pointer' : !readOnly })} onClick={handleLabelClick}>{value}</h3>
  )
}

export default EditableLabel
