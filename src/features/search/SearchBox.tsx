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
  size: 'md' | 'lg'
  dark?: boolean
  shadow?: boolean
  border?: boolean
  transparent?: boolean
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
  transparent = false
}) => {
  const [stateValue, setStateValue] = React.useState('')
  const [debouncedValue] = useDebounce(stateValue, DEBOUNCE_TIMER)

  React.useEffect(() => {
    if (onChange) {
      onChange(stateValue)
    }
  }, [debouncedValue, onChange, stateValue])

  React.useEffect(() => {
    setStateValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setStateValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(stateValue)
    }
  }

  return (
    <form className={classNames('relative flex focus-within:border-qripink border rounded-lg w-full', {
      'bg-transparent': transparent,
      'bg-white': !transparent,
      'border-qrigray-300': !dark && border,
      'border-black': dark && border,
      'border-0': !border
    })} onSubmit={handleSubmit} style={{
      boxShadow: shadow ? '0px 0px 8px rgba(0, 0, 0, 0.1)' : '',
      padding: size === 'lg' ? '8px 20px' : '4px 10px',
      height: size === 'lg' ? '50px' : '34px'
    }}>
      <input
        className={classNames('focus:ring-transparent border-0 bg-transparent block w-full placeholder-opacity-50 p-0', {
          'placeholder-black': dark,
          'placeholder-qrigray-300': !dark,
          'text-sm': size === 'md',
          'text-base': size === 'lg',
        })}
        id='search'
        name='search'
        type='text'
        placeholder={placeholder}
        value={stateValue || ''}
        onChange={handleChange}
      />
      <div className={classNames('flex items-center', {
        'text-qrigray-300': !dark,
        'text-black': dark
      })}>
        <Icon size='sm' icon='skinnySearch' />
      </div>
    </form>
  )
}

export default SearchBox
