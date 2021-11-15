import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import SimpleMDE from "react-simplemde-editor"

import Icon from "../../chrome/Icon"
import ManualCreationBodyWrapper from "./ManualCreationBodyWrapper"
import { selectManualDatasetReadme } from "./state/manualDatasetCreationState"
import { setManualDatasetCreationReadme } from "./state/manualDatasetCreationActions"

const ManualDatasetReadMe: React.FC<{}> = () => {
  const [editing, setEditing] = useState(false)
  const readme = useSelector(selectManualDatasetReadme)
  const [internalValue, setInternalValue] = useState<string>(readme)
  const dispatch = useDispatch()

  useEffect(() => {
    setInternalValue(readme)
  }, [])

  const handleChange = (value: string) => {
    setInternalValue(value)
    dispatch(setManualDatasetCreationReadme(internalValue))
  }

  return (
    <ManualCreationBodyWrapper>
      {editing
        ? <SimpleMDE
          id="readme-editor"
          value={internalValue}
          onChange={handleChange}
          options={{
            spellChecker: false,
            sideBySideFullscreen: false,
            toolbar: [
              'preview',
              'bold',
              'italic',
              'strikethrough',
              'heading',
              '|',
              'code',
              'quote',
              '|',
              'link',
              'image',
              'table',
              '|',
              'unordered-list',
              'ordered-list'
            ],
            status: false,
            placeholder: 'Start writing your readme here'
          }}
        />
        : <div onClick={() => setEditing(true)} className='text-qrigray-400 w-full flex flex-col text-center h-full items-center justify-center border rounded'>
          <Icon icon='face' size='lg' />
          <p>Seems that you don’t have a readme, <br/> click inside the box to start.</p>
        </div>}
    </ManualCreationBodyWrapper>
  )
}

export default ManualDatasetReadMe
