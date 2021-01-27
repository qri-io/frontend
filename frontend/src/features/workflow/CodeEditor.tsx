import React from 'react'
import MonacoEditor from 'react-monaco-editor'

export interface CodeEditorProps {
  script: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

// TODO (ramfox): consts used when attempting to set set editor height to the 
// height of the script content
// // line height of the default monaco theme
// const LINE_HEIGHT = 19
// const MIN_LINE_COUNT = 4

const CodeEditor: React.FC<CodeEditorProps> = ({ script, onChange, disabled }) => {
  
  /**
   * TODO (ramfox): starting point to detect the number of lines in the
   * script & setting the editor height to expand to fit it
   * Two remaining (large) issues
   * 1) first iteration of detection happens in the `editorDidMount` func however
   * it looks like the editor at this point doesn't actually have an accurate count
   * of how many lines are in the editor. Need to double check that it actually 
   * contains the correct content, otherwise the issue might be that before the 
   * component mounts we don't actually have the correct props/`script`
   * 2) monaco editor seems to have some styling that forces a vertical scroll bar
   * or just forces a few extra empty "lines" at the end of the script so the scroll
   * bar is always present. Pretty sure we just need to figure out the correct 
   * settings to override
  // const ref = useRef<MonacoEditor>(null)
  // const [lineCount, setLineCount] = useState(MIN_LINE_COUNT)  */  

  // const handleSetLineCount = (count: number) => {
  //   if (count < MIN_LINE_COUNT) {
  //     count = MIN_LINE_COUNT
  //   }
  //   setLineCount(count)
  // }

  // const editorDidMount = (editor: any) => {
  //   const currLineHeight = editor.getModel().getLineCount()
  //   if (currLineHeight > 4) {
  //     handleSetLineCount(editor.getModel().getLineCount())
  //   }
  // }

  return (
    <MonacoEditor
      // TODO (ramfox): starting poitn to adjust the height based on the number
      // lines in the script
      // ref={ref}
      // height={lineCount * LINE_HEIGHT}
      height={200}
      value={script as any as string}
      onChange={(e: any) => { 
        console.log('event!', e)
        if (e && e.target) {
          onChange(e.target.value) 
        }
        // TODO (ramfox): starting point to adjust # of lines based on script
        // content:
        // if (ref) {
        //   handleSetLineCount(ref.current?.editor?.getModel()?.getLineCount() || 4)
        // }
      }}
      language='python'
      theme='vs-dark'
      // TODO (ramfox): starting point to set the # of lines based on initial
      // script content
      // editorDidMount={editorDidMount}
      options={{
        scrollbar:{
          vertical: "hidden",
          horizontalScrollbarSize: 4
        },
        minimap: {
          enabled: false
        }
      }}
    />
  )
}

export default CodeEditor
