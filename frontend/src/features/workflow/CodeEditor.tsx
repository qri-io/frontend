import React, { useState, useEffect, useRef } from 'react'
import MonacoEditor from 'react-monaco-editor'

export interface CodeEditorProps {
  script: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

const LINE_HEIGHT = 19
const MIN_LINE_COUNT = 4
const PADDING = 14

const CodeEditor: React.FC<CodeEditorProps> = ({ script, onChange }) => {
  const ref = useRef<MonacoEditor>(null)

  const [lineCount, setLineCount] = useState(MIN_LINE_COUNT)
  const [theEditor, setTheEditor] = useState<MonacoEditor['editor']>()

  const handleSetLineCount = (count: number) => {
    if (count < MIN_LINE_COUNT) {
      count = MIN_LINE_COUNT
    }
    setLineCount(count)
  }

  const handleEditorWillMount = (monaco: any) => {
    if (monaco.editor) {
      monaco.editor.defineTheme("qri-theme", {
          base: 'vs',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': '#f4f6f8',
        	}
      });
    }
  }

  const handleEditorDidMount = (editor: MonacoEditor['editor']) => {
    setTheEditor(editor)
    if (theEditor) {
      const theModel = theEditor.getModel()
      if (theModel) {
        const currLineHeight = theModel.getLineCount()
        if (currLineHeight > 4) {
          handleSetLineCount(currLineHeight)
        }
      }
    }
  }

  const handleResize = () => {
    console.log('calling layout')
    if (theEditor) theEditor.layout()
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <MonacoEditor
      ref={ref}
      height={(lineCount * LINE_HEIGHT) + PADDING}
      value={script as any as string}
      onChange={(script: string) => {
        onChange(script)

        if (ref) {
          handleSetLineCount(ref.current?.editor?.getModel()?.getLineCount() || 4)
        }
      }}
      language='python'
      theme='qri-theme'
      options={{
        scrollbar:{
          vertical: "hidden",
          horizontalScrollbarSize: 4,
          alwaysConsumeMouseWheel: false
        },
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false
        },
        padding: {
          top: 10,
          bottom: 10
        }
      }}
      editorDidMount={handleEditorDidMount}
      editorWillMount={handleEditorWillMount}
    />
  )
}

export default CodeEditor
