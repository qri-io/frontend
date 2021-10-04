import React, { useState, useEffect, useRef } from 'react'
import MonacoEditor, { EditorConstructionOptions } from 'react-monaco-editor'
import { KeyMod, KeyCode } from "monaco-editor/esm/vs/editor/editor.api";
import classNames from 'classnames'
import { RunStatus } from "../../qri/run";

export interface CodeEditorProps {
  script: string
  disabled?: boolean
  // determines whether the Component should render with rounded corners on the bottom
  standalone?: boolean
  onChange: (newValue: string) => void
  hasOutput: boolean;
  onRun?: () => void
  status?: RunStatus
}

const LINE_HEIGHT = 19
const MIN_LINE_COUNT = 4
const PADDING = 15

export const MONACO_EDITOR_OPTIONS: EditorConstructionOptions = {
  scrollbar: {
    vertical: 'hidden',
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
  },
  wordWrap: 'on'
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  script,
  standalone = true,
  onChange,
  onRun = () => {},
  disabled,
  hasOutput,
  status
}) => {
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
    monaco?.editor?.defineTheme("qri-theme", {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#fff',
      	}
    });
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

  useEffect(() => {
    theEditor?.addAction({
      id: "executeCurrentAndAdvance",
      label: "Execute Block and Advance",
      keybindings: [KeyMod.CtrlCmd | KeyCode.Enter],
      contextMenuGroupId: "2_execution",
      precondition: "editorTextFocus && !suggestWidgetVisible && !renameInputVisible && !inSnippetMode && !quickFixWidgetVisible",
      run: () => {
        onRun()
      }
    })
  }, [theEditor, onRun])

  const handleEditorDidMount = (editor: MonacoEditor['editor']) => {
    setTheEditor(editor)
  }

  const handleResize = () => {
    theEditor?.layout()
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  let borderStyles = '';
  if(status === 'succeeded') {
    borderStyles = `border-qrigreen border-2 border-solid ${hasOutput && 'border-b-0'}`
  }else if(status === 'running'){
    borderStyles = 'border-qrinavy-700 border-2 border-solid border-b-0 -mb-1'
  }else if(status === 'failed'){
    borderStyles = `border-dangerred border-2 border-solid ${hasOutput && 'border-b-0'}`
  }else{
    borderStyles = 'border-transparent hover:border-qritile border-2 border-solid'
  }

  return (
    <div className={classNames(`rounded-t-lg overflow-hidden flex-grow transition-all ${borderStyles}`, {
      'rounded-b-lg': standalone
    })}>
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
        options={{...MONACO_EDITOR_OPTIONS, readOnly: disabled}}
        editorDidMount={handleEditorDidMount}
        editorWillMount={handleEditorWillMount}
      />
    </div>
  )
}

export default CodeEditor
