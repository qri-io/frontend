import React from 'react'

export interface CodeEditorProps {
  script: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

const CodeEditor: React.FC<CodeEditorProps> = ({ script, onChange, disabled }) => {
  return (
    <textarea
      className='w-full font-mono p-2 text-gray-900 bg-gray-200'
      value={script as any as string}
      onChange={(e: any) => { onChange(e.target.value) }}
      style={{
        height: 200,
        verticalAlign: 'top'
      }}
    />
  )
}

export default CodeEditor
