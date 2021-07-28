import classNames from 'classnames'
import React, { useState, useEffect, useRef } from 'react'

import { ValidationError } from '../features/session/state/formValidation'

export interface EditableLabelProps {
  name: string
  value: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  readOnly?: boolean
  validator?: (name: string) => ValidationError
  onChange: (name: string, value: string) => void
}

const EditableLabel: React.FC<EditableLabelProps> = ({
  name,
  value,
  size = 'md',
  readOnly = false,
  validator,
  onChange
}) => {
  const [editing, setEditing] = useState(false)
  const [edit, setEdit] = useState(value)

  const inputEl = useRef(null)

  // if a new value prop is passed in, update local state
  useEffect(() => {
    setEdit(value)
  }, [value])

  useEffect(() => {
    inputEl.current?.select()

    // escape key press
    const close = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        setEdit(value)
        setEditing(false)
      }
    }

    // add/remove listener for escape key
    if (editing) {
      window.addEventListener('keydown', close)
    } else {
      window.removeEventListener('keydown', close)
    }
  }, [editing])

  const handleLabelClick = () => {
    if (readOnly) { return }
    if (!editing) { setEditing(true) }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // apply the change
    if (e.key === 'Enter') {
      e.preventDefault()
      onChange(name, edit)
      setEditing(false)
    }
  }

  const handleChange = (e: any) => {
    const newValue = e.target.value
    if (validator) {
      const error = validator(newValue)
      if (!error) { setEdit(newValue) }
    } else {
      setEdit(newValue)
    }
  }

  const handleBlur = (e: any) => {
    setEditing(false)
  }

  return (editing
    ? <input
        ref={inputEl}
        type='text'
        className='border-qrigray-400 focus:ring-0 block w-full rounded-lg bg-transparent'
        value={edit}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
    : <h3 className={classNames({ 'cursor-pointer whitespace-nowrap' : !readOnly })} onClick={handleLabelClick}>{value}</h3>
  )
}

export default EditableLabel
