import React from 'react'

interface TextInputProps {
  placeholder?: string
}

const TextInput: React.FC<TextInputProps> = ({ placeholder }) => {
  return (
    <div className='mb-2'>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="text"
          name="price"
          id="price"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2 sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default TextInput
