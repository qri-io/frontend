import React from 'react'
import classNames from 'classnames'

import Icon from '../../chrome/Icon'

interface BigSearchBoxProps {
  value?: string
  className?: string
  onSubmit: (q: string) => void
}

const BigSearchBox: React.FC<BigSearchBoxProps> = ({ onSubmit, value='', className }) => {
  const [stateValue, setStateValue] = React.useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    onSubmit(stateValue)
  }

  return (
    <form className={classNames("relative rounded-md shadow-sm w-full", className)} onSubmit={handleSubmit}>
      <input
        className="border-0 block w-full sm:text-xs rounded-lg tracking-wider placeholder-gray-600 placeholder-opacity-50"
        style={{
          padding: '16px 8px 16px 8px'
        }}
        id='search'
        name='search'
        type='text'
        placeholder='Search'
        value={stateValue}
        onChange={handleChange}
      />
      <span className='absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400'>
        <Icon size='sm' icon='skinnySearch' />
      </span>
    </form>
  )
}

export default BigSearchBox
