import React from 'react'

interface MonospaceProps {
  data: string
}

const Monospace: React.FC<MonospaceProps> = ({
  data = ''
}) => (
  <div
    className='text-xs w-full'
    /* setting maxWidth fixes an overflow-x bug affecting parent flex 
       containers. Observed on Chrome */
    style={{ maxWidth: 800 }}
  >
    <pre className='float-left text-right mr-4 text-gray-600'>{data.split('\n').map((_, i) => (`${i+1}\n`))}</pre>
    <pre>{data}</pre>
  </div>
)

export default Monospace
