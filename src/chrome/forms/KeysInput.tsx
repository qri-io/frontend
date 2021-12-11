import React, { createRef, useState } from "react"

interface KeysInputProps {
  value: string[]
  onChange: (newArray: string[]) => void
  placeholder?: string
}

const KeysInput: React.FC<KeysInputProps> = ({
  value,
  onChange,
  placeholder
}) => {
  const [input, setInput] = useState('')
  const [focus, setFocus] = useState(false)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const inputRef = createRef<HTMLInputElement>()

  const onContainerClick = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange([...value, input])
      setInput('')
    }
  }

  const onKeyDelete = (index: number) => {
    const newValue: string[] = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  return (
    <div onClick={onContainerClick} className={`flex flex-wrap w-full border rounded ${focus ? 'border-qripink-600' : 'border-qrigray-300'}`}>
      {value.map((key: string, index: number) => {
        return (
          <div
            key={index}
            className='border rounded border-black cursor-pointer px-2 py-1 text-xs m-1.5'
            onClick={() => onKeyDelete(index)}>
            {key}
          </div>
        )
      })}
      <input
        ref={inputRef}
        value={input}
        placeholder={placeholder}
        onChange={onInputChange}
        className='text-sm placeholder-qrigray-400 border-none outline-none focus:ring-transparent focus:outline-none'
        type="text"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

export default KeysInput
