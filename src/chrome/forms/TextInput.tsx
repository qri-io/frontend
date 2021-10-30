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
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void | undefined
  onChange?: (value: string) => void | undefined
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  white?: boolean
  tooltipFor?: string
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  type='text',
  label,
  labelTooltip,
  value,
  maxLength,
  error,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
}) => {
  const [stateValue, setStateValue] = React.useState(value)

  React.useEffect(() => {
    if (onChange) {
      onChange(stateValue)
    }
  }, [stateValue, onChange])

  const handleOnChange = (e: React.ChangeEvent) => {
    setStateValue(e.target.value)
  }

  return (
    <div className='mb-2'>
      <div className="mt-1 mb-2 relative rounded-md shadow-sm">
        {label && <InputLabel
          label={label}
          tooltip={labelTooltip}
          tooltipFor={name}
        />}
        <input
          className="focus:ring-transparent focus:border-qripink-600 block w-full px-2 text-sm border-qrigray-300 rounded-md placeholder-qrigray-400 rounded-lg"
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
