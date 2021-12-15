import React from 'react'
import classNames from 'classnames'

import InputLabel from './InputLabel'

export interface TextareaInputProps {
  label?: string
  labelTooltip?: string
  name: string
  value: any
  maxLength?: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => {} | undefined
  error?: string
  onChange?: (d: string) => void
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  white?: boolean
  tooltipFor?: string
  className?: string
  inputClassName?: string
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  label,
  labelTooltip,
  name,
  value,
  maxLength,
  error,
  onChange,
  onBlur,
  placeholder,
  rows = 3,
  tooltipFor,
  className,
  inputClassName
}) => {
  const handleOnChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement
    if (onChange) onChange(target.value)
  }

  return (
    <div className={classNames('text-input-container', className)}>
      {label && <InputLabel
        label={label}
        tooltip={labelTooltip}
        tooltipFor={tooltipFor}
      />}
      <textarea
        id={name}
        name={name}
        maxLength={maxLength}
        className={classNames('focus:ring-transparent focus:border-qripink-600 block w-full px-2 text-sm border-qrigray-300 rounded-md placeholder-qrigray-400 rounded-lg', inputClassName)}
        value={value}
        placeholder={placeholder}
        onChange={handleOnChange}
        onBlur={onBlur}
        rows={rows}
      />
      <div className='text-xs text-red-500 text-left'>{error}</div>
    </div>
  )
}

export default TextareaInput
