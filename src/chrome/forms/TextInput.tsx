import React from 'react'
import InputLabel from './InputLabel'

interface TextInputProps {
  name: string
  type?: string
  value: any
  maxLength?: number
  error?: string | null
  helpText?: string
  showHelpText?: boolean
  label?: string
  labelTooltip?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => {} | undefined
  onChange?: (value: string) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  white?: boolean
  tooltipFor?: string
  className?: string
  inputClassName?: string
  size?: 'sm' | 'md' | 'lg'
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  type = 'text',
  label,
  labelTooltip,
  value,
  maxLength,
  error,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
  className,
  inputClassName,
  size = 'md'
}) => {
  const [stateValue, setStateValue] = React.useState(value)

  const handleOnChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement
    setStateValue(target.value)
    if (onChange) {
      onChange(target.value)
    }
  }

  return (
    <div className={`${className}`}>
      <div className="mt-2 mb-2 relative rounded-md shadow-sm">
        {label && <InputLabel
          label={label}
          tooltip={labelTooltip}
          tooltipFor={name}
        />}
        <input
          className={`focus:ring-transparent focus:border-qripink-600 block w-full px-2 text-sm border-qrigray-300 rounded-md placeholder-qrigray-400 rounded-lg ${inputClassName}`}
          style={{
            height: (size === 'sm') ? 24 : ''
          }}
          id={name}
          name={name}
          type={type}
          maxLength={maxLength}
          value={stateValue || ''}
          placeholder={placeholder}
          onChange={handleOnChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className='text-xs text-red-500 text-left'>{error}</div>
    </div>
  )
}

export default TextInput
