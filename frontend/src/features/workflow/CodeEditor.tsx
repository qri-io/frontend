import React from 'react'

export interface CodeEditorProps {
  value: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, disabled }) => {
  return (
    <textarea
      className={`w-full font-mono bg-white ${disabled && 'text-gray-400'}`}
      value={value as any as string}
      onChange={(e: any) => { onChange(e.target.value) }}
    />
  )
}

export default CodeEditor
