import React from 'react'
import MonacoEditor from 'react-monaco-editor'

import { scriptFromTransform, Transform } from '../../../qri/dataset'
import { MONACO_EDITOR_OPTIONS } from '../../workflow/CodeEditor'

export interface TransformProps {
  data: Transform
}

export const TransformComponent: React.FunctionComponent<TransformProps> = ({
  data
}) => {
  return (
    <div className='rounded-lg overflow-hidden h-full '>
      <MonacoEditor
        value={scriptFromTransform(data) as any as string}
        language='python'
        theme='qri-theme'
        options={{
          ...MONACO_EDITOR_OPTIONS,
          readOnly: true
        }}
      />
    </div>
  )
}

export default TransformComponent
