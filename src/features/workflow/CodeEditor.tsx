import React, { useState, useEffect, useRef } from 'react'
import MonacoEditor from 'react-monaco-editor'

export interface CodeEditorProps {
  script: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

const LINE_HEIGHT = 19
const MIN_LINE_COUNT = 4
const PADDING = 15

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

  useEffect(() => {
    if (theEditor) {
      const theModel = theEditor.getModel()
      if (theModel) {
        const currLineHeight = theModel.getLineCount()
        if (currLineHeight > 4) {
          handleSetLineCount(currLineHeight)
        }
        theModel.updateOptions({ tabSize: 2, insertSpaces: true, indentSize: 2 })
      }
    }
  }, [theEditor])

  const handleEditorDidMount = (editor: MonacoEditor['editor']) => {
    setTheEditor(editor)
  }

  const handleResize = () => {
    if (theEditor) theEditor.layout()
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <div className='rounded-lg overflow-hidden'>
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
    </div>
  )
}

export default CodeEditor
