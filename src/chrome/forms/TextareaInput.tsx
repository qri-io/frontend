import React from 'react'

import InputLabel from './InputLabel'

export interface TextareaInputProps {
  label?: string
  labelTooltip?: string
  name: string
  value: any
  maxLength: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void | undefined
  onChange?: (e: React.ChangeEvent) => void
  onBlur?: (event: React.FocusEvent<HTMLTextareaElement>) => void
  placeholder?: string
  rows?: number
  white?: boolean
  tooltipFor?: string
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  label,
  labelTooltip,
  name,
  value,
  maxLength,
  onChange,
  onBlur,
  placeholder,
  rows = 3,
  tooltipFor
}) => {

  const handleOnChange = (e: React.ChangeEvent) => {
    if (onChange) onChange(e)
  }

  return (
    <div className='text-input-container'>
      {label && <InputLabel
        label={label}
        tooltip={labelTooltip}
        tooltipFor={tooltipFor}
      />}
      <textarea
        id={name}
        name={name}
        maxLength={maxLength}
        className='input'
        value={value}
        placeholder={placeholder}
        onChange={handleOnChange}
        onBlur={onBlur}
        rows={rows}
      />
      {/* placeholder for error text to match spacing with other form inputs */}
      <div style={{ height: 20 }} />
    </div>
  )
}

export default TextareaInput
