import React from 'react'

interface NumericLabelProps {
  number: number | string
  label: string
}

const NumericLabel: React.FC<NumericLabelProps> = ({
  number,
  label
}) => (
  <div className='flex items-center px-3 border-r border-qrigray-300 first:pl-0 last:border-0'>
    <div className='text-qrinavy font-medium mr-2'>
      {number}
    </div>
    <div className='text-qrigray-400 text-sm'>
      {label}
    </div>
  </div>
)

export default NumericLabel
