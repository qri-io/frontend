import React from 'react'

import InputLabel from './InputLabel'
import Icon from '../Icon'

export interface TagInputProps {
  label: string
  labelTooltip?: string
  name: string
  value: any
  onArrayChange: (e: React.SyntheticEvent, name: string, value: any) => void
  placeHolder?: string
  tooltipFor?: string
}

const KeyCodes = {
  comma: 188,
  enter: 13
}

const delimiters = [ KeyCodes.comma, KeyCodes.enter ]

const TagInput: React.FC<TagInputProps> = ({
  label,
  labelTooltip,
  name,
  value = [],
  onArrayChange,
  placeHolder,
  tooltipFor
}) => {

  const id = `${name}-tag-input`

  const setTag = (e: React.SyntheticEvent, tagString: string) => {
    const i = document.getElementById(id)
    if (i) i.value = ''
    const newTagList = [...value, tagString]
    onArrayChange(e, name, newTagList)
  }

  const handleKeyDown = (e: any) => {
    if (delimiters.includes(e.keyCode)) {
      e.preventDefault()
      setTag(e, e.target.value.trim())
    }
  }

  const handleBlur = (e: any) => {
    const tagString = e.target.value.trim()
    if (tagString === '') return
    if (e.target.value) {
      setTag(e, tagString)
    }
  }

  const removeItem = (e: React.SyntheticEvent, index: number) => {
    const clonedValue = Object.assign([], value)
    clonedValue.splice(index, 1)
    onArrayChange(e, name, clonedValue)
  }

  return (
    <div className='multi-text-input-container'>
      <InputLabel
        label={label}
        tooltip={labelTooltip}
        tooltipFor={tooltipFor}
      />
      <div className='multi-text-input'>
        {value.map((d: string, i: number) => (
          <div key={i} className='tag' id={`${name}-tag-${i}`}>
            <span className='tag-text'>{d}</span>
            <span className='tag-remove' onClick={(e: React.SyntheticEvent) => { removeItem(e, i) }}>
              <Icon icon='times'  size='sm' />
            </span>
          </div>
        ))}
        <input
          id={id}
          className='input tag-input'
          type='text'
          placeholder={placeHolder}
          defaultValue={''}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </div>
      {/* placeholder for error text to match spacing with other form inputs */}
      <div style={{ height: 20 }} />
    </div>
  )
}

export default TagInput
