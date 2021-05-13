import React from 'react'

import Icon from '../../chrome/Icon'

const HistorySearchBox: React.FC<{}> = () => {
  const [stateValue, setStateValue] = React.useState<string>('')

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value || '')
  }

  return (
    <form className="relative rounded-md shadow-sm w-full mb-5" >
      <input
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-xs border-gray-400 rounded-lg tracking-wider placeholder-gray-600 placeholder-opacity-50 bg-transparent"
        style={{
          padding: '8px 8px 10px 32px'
        }}
        id='search'
        name='search'
        type='text'
        value={stateValue}
        onChange={handleOnChange}
      />
      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400'>
        <Icon size='sm' icon='skinnySearch' />
      </span>
    </form>
  )
}

export default HistorySearchBox
