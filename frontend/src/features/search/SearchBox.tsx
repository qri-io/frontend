import React from 'react'

import Icon from '../../chrome/Icon'

const SearchBox: React.FC<{}> = () => {
  const [stateValue, setStateValue] = React.useState('')

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value)
  }

  return (
    <form className="my-1 mx-2 relative rounded-md shadow-sm w-48" >
      <input
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-xs border-gray-400 rounded-lg tracking-wider placeholder-gray-600 placeholder-opacity-50"
        style={{
          padding: '8px 8px 10px 8px'
        }}
        id='search'
        name='search'
        type='text'
        placeholder='Search'
        value={stateValue || ''}
        onChange={handleOnChange}
      />
      <span className='absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400'>
        <Icon size='sm' icon='skinnySearch' />
      </span>
    </form>
  )
}

export default SearchBox
