import React from 'react'

export interface CodeEditorProps {
  value: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, disabled }) => {
  return (
    <textarea
      className={`w-full font-mono p-2 text-white bg-gray-600 height- `}
      value={value as any as string}
      onChange={(e: any) => { onChange(e.target.value) }}
      style={{
        height: 200,
        verticalAlign: 'top'
      }}
    />
  )
}

export default CodeEditor
