import React from 'react'

interface CodeProps {
  data: string
}

const Code: React.FunctionComponent<CodeProps> = (props: CodeProps) => {
  const { data = '' } = props
  const lines = data.split('\n')

  return (
    <div
      className='text-xs w-full'
      /* setting maxWidth fixes an overflow-x bug affecting parent flex 
         containers. Observed on Chrome */
      style={{ maxWidth: 800 }}
    >
      <pre className='float-left text-right mr-4 text-gray-600'>{lines.map((_, i) => (`${i+1}\n`))}</pre>
      <pre>{data}</pre>
    </div>
  )
}

export default Code
