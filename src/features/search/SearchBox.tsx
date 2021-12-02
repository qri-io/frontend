import React from 'react'
import { useDebounce } from 'use-debounce'
import classNames from 'classnames'

import Icon from '../../chrome/Icon'

const DEBOUNCE_TIMER = 500

interface SearchBoxProps {
  onChange?: (q: string) => void
  onSubmit?: (q: string) => void
  placeholder?: string
  value?: string
  size?: 'md' | 'lg'
  dark?: boolean
  shadow?: boolean
  border?: boolean
  transparent?: boolean
  disabled?: boolean
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onChange,
  onSubmit,
  placeholder = 'Search',
  value,
  size = 'md',
  dark = false,
  shadow = false,
  border = true,
  transparent = false,
  disabled = false
}) => {
  const [stateValue, setStateValue] = React.useState('')
  const [debouncedValue] = useDebounce(stateValue, DEBOUNCE_TIMER)

  React.useEffect(() => {
    if (onChange) {
      onChange(stateValue)
    }
  }, [debouncedValue, onChange, stateValue])

  React.useEffect(() => {
    if (value) {
      setStateValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(stateValue)
    }
  }

  const DEFAULT_HEIGHT = 34
  const LARGE_HEIGHT = 50

  return (
    <form className={classNames('relative flex focus-within:border-qripink-600 w-full', {
      'bg-transparent': transparent,
      'bg-white': !transparent,
      'border border-qrigray-300': !dark && border,
      'border border-black': dark && border,
      'rounded-xl': size === 'lg',
      'rounded-lg': size !== 'lg',
      'border-0': !border
    })} onSubmit={handleSubmit} style={{
      boxShadow: shadow ? '0px 0px 8px rgba(0, 0, 0, 0.1)' : '',
      height: size === 'lg' ? LARGE_HEIGHT : DEFAULT_HEIGHT
    }}>
      <input
        className={classNames('focus:ring-transparent border-0 bg-transparent block w-full p-0', {
          'placeholder-black': dark,
          'placeholder-qrigray-300': !dark,
          'text-sm': size === 'md',
          'text-base rounded-xl': size === 'lg',
          'rounded-lg': size !== 'lg',
          'cursor-pointer': disabled
        })}
        id='search'
        name='search'
        type='text'
        placeholder={placeholder}
        value={stateValue || ''}
        onChange={handleChange}
        style={{
          padding: size === 'lg' ? '0 45px 0 20px' : '0 20px 0 10px',
          lineHeight: size === 'lg' ? LARGE_HEIGHT : DEFAULT_HEIGHT
        }}
        disabled={disabled}
      />
      <div className={classNames('flex items-center absolute right-0 h-full px-3', {
        'text-qrigray-300': !dark,
        'text-black': dark
      })}>
        <Icon size='sm' icon='skinnySearch' />
      </div>
    </form>
  )
}

export default SearchBox
