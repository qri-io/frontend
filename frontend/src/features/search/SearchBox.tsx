import React from 'react'

import Icon from '../../chrome/Icon'

const SearchBox: React.FC<{}> = () => {
  const [stateValue, setStateValue] = React.useState('')

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value)
  }

  return (
    <form className="my-1 mx-2 relative rounded-md shadow-sm">
      <input
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2 sm:text-sm border-gray-300 rounded-md"
        id='search'
        name='search'
        type='text'
        value={stateValue || ''}
        placeholder='search'
        onChange={handleOnChange}
      />
      <Icon className='absolute right-3 top-3 text-gray-500' size='sm' icon='search' />
    </form>
  )
}

export default SearchBox
