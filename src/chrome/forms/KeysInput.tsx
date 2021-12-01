import React, { createRef, useState } from "react"
import Icon from "../Icon"

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
            className='border rounded border-black cursor-pointer px-2 py-1 text-xs m-1.5 group relative'
            onClick={() => onKeyDelete(index)}>
            <Icon
              icon={'close'}
              size={"3xs"}
              className='opacity-0 absolute -top-1 -right-1.5 transition-opacity bg-white border border-white group-hover:opacity-100'
            />
            {key}
          </div>
        )
      })}
      <input
        ref={inputRef}
        value={input}
        placeholder={placeholder}
        onChange={onInputChange}
        className='text-sm placeholder-qrigray-400 w-72 border-none outline-none focus:ring-transparent focus:outline-none'
        type="text"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

export default KeysInput
