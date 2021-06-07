import React from 'react'
import { useDebounce } from 'use-debounce'
import classNames from 'classnames'

import Icon from '../../chrome/Icon'


interface SearchBoxProps {
  onChange?: (q: string) => void
  onSubmit?: (q: string) => void
  dark?: boolean
}

const SearchBox: React.FC<SearchBoxProps> = ({ onChange, onSubmit, dark = false }) => {
  const DEBOUNCE_TIMER = 500

  const [stateValue, setStateValue] = React.useState('')
  const [debouncedValue] = useDebounce(stateValue, DEBOUNCE_TIMER)

  React.useEffect(() => {
    if (onChange) {
      onChange(stateValue)
    }
  }, [debouncedValue])

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
    <form className="my-1 mx-2 relative rounded-md shadow-sm w-48" onSubmit={handleSubmit}>
      <input
        className={classNames('focus:ring-qriblue block w-full sm:text-xs rounded-lg tracking-wider bg-transparent placeholder-opacity-50', {
          'border-gray-400 placeholder-gray-600': !dark,
          'border-qrinavy placeholder-qrinavy': dark
        })}
        style={{
          padding: '8px 8px 10px 8px'
        }}
        id='search'
        name='search'
        type='text'
        placeholder='Search'
        value={stateValue || ''}
        onChange={handleChange}
      />
      <span className={classNames('absolute inset-y-0 right-0 flex items-center pr-2', {
        'text-gray-400': !dark,
        'text-qrinavy': dark
      })}>
        <Icon size='sm' icon='skinnySearch' />
      </span>
    </form>
  )
}

export default SearchBox
