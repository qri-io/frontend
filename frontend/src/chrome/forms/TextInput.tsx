import React from 'react'

interface TextInputProps {
  name: string
  type?: string
  value: any
  maxLength?: number
  error?: string | null
  helpText?: string
  showHelpText?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void | undefined
  onChange?: (e: React.ChangeEvent) => void | undefined
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  white?: boolean
  tooltipFor?: string
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  type='text',
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
    if (value !== stateValue) setStateValue(value)
  }, [value, stateValue])

  const handleOnChange = (e: React.ChangeEvent) => {
    if (onChange) onChange(e)
    else setStateValue(e.target.value)
  }

  return (
    <div className='mb-2'>
      <div className="mt-1 mb-1 relative rounded-md shadow-sm">
        <input
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2 sm:text-sm border-gray-300 rounded-md"
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
