import React from 'react'

interface CodeProps {
  data: string
}

const Code: React.FunctionComponent<CodeProps> = (props: CodeProps) => {
  const { data = '' } = props
  const lines = data.split('\n')

  return (
    <div className='text-xs overflow-x-auto'>
      <pre className='float-left text-right mr-4 text-gray-600'>{lines.map((_, i) => (`${i+1}\n`))}</pre>
      <pre>{data}</pre>
    </div>
  )
}

export default Code
