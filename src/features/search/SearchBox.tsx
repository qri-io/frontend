import React from 'react'
import { useDebounce } from 'use-debounce'
import classNames from 'classnames'

import Icon from '../../chrome/Icon'

const DEBOUNCE_TIMER = 500

interface SearchBoxProps {
  onChange?: (q: string) => void
  onSubmit?: (q: string) => void
  placeholder?: string
  dark?: boolean
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onChange,
  onSubmit,
  placeholder = 'Search',
  dark = false
}) => {
  const [stateValue, setStateValue] = React.useState('')
  const [debouncedValue] = useDebounce(stateValue, DEBOUNCE_TIMER)

  React.useEffect(() => {
    if (onChange) {
      onChange(stateValue)
    }
  }, [debouncedValue, onChange, stateValue])

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
    <form className="my-1 mx-2 relative shadow-sm w-48" onSubmit={handleSubmit}>
      <input
        className={classNames('focus:ring-qripink focus:border-qripink block w-full rounded-md tracking-wider bg-transparent placeholder-opacity-50', {
          'border-qrigray-300 placeholder-qrigray-300': !dark,
          'border-black placeholder-black': dark
        })}
        style={{
          padding: '4px 8px 4px 8px',
          fontSize: 11
        }}
        id='search'
        name='search'
        type='text'
        placeholder={placeholder}
        value={stateValue || ''}
        onChange={handleChange}
      />
      <span className={classNames('absolute inset-y-0 right-0 flex items-center pr-2', {
        'text-qrigray-300': !dark,
        'text-black': dark
      })}>
        <Icon size='sm' icon='skinnySearch' />
      </span>
    </form>
  )
}

export default SearchBox
