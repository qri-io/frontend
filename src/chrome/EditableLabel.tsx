import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'

import { ValidationError } from '../features/session/state/formValidation'

export interface EditableLabelProps {
  name: string
  value?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  readOnly?: boolean
  validator?: (name: string) => ValidationError
  onChange?: (name: string, value: string) => void
  placeholder?: string
  textClassName?: string
  showOutline?: boolean
}

const EditableLabel: React.FC<EditableLabelProps> = ({
  name,
  value = '',
  size = 'md',
  readOnly = false,
  validator,
  onChange,
  placeholder,
  textClassName = '',
  showOutline = false
}) => {
  const [editing, setEditing] = useState(false)
  const [edit, setEdit] = useState(value)

  const inputEl = useRef<HTMLInputElement>(null)

  // if a new value prop is passed in, update local state
  useEffect(() => {
    setEdit(value)
  }, [value])

  useEffect(() => {
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
    if (!onChange) { return }
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

  const handleBlur = () => {
    setEditing(false)
    if (!onChange) { return }
    onChange(name, edit)
  }

  let sizeClassName = ''
  switch (size) {
    case "sm":
      sizeClassName = 'h-6'
      break
  }

  return (
    <input
      ref={inputEl}
      type='text'
      className={classNames(`focus:border-transparent focus:ring-transparent block w-full rounded-lg bg-transparent px-1 py-0 transitions-all duration-100`,
        sizeClassName,
        textClassName,
        {
          'border-qripink-600 bg-white border focus:border-qripink-600': editing,
          'border-transparent focus:border-transparent': !editing,
          'px-1 py-0': size === 'md',
          '-ml-2 px-2 pt-1.5 pb-1 leading-tight': size === 'lg',
          'hover:border-qrigray-300': !readOnly,
          'border-qrigray-300': showOutline
        })}
      value={edit}
      placeholder={placeholder}
      disabled={readOnly}
      onKeyPress={handleKeyPress}
      onChange={handleChange}
      onBlur={handleBlur}
      onClick={handleLabelClick}
    />
  )
}

export default EditableLabel
