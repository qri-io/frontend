import React, { useEffect, useState } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { useDebounce } from 'use-debounce'

import { API_BASE_URL } from '../../../store/api'
import { hasParseError, StatusInfo } from '../../../qri/status'
import { NewDataset, NewReadme } from '../../../qri/dataset'
import { QriRef } from '../../../qri/ref'
import Spinner from '../../../chrome/Spinner'
import ParseFileError from '../../dsComponents/ParseFileError'

// import { refStringFromQriRef, QriRef, qriRefFromRoute } from '../../../models/qriRef'
// import Store, { StatusInfo, RouteProps } from '../../../models/store'
// import { openExternal } from './platformSpecific/Readme.TARGET_PLATFORM'
// import { selectWorkingDatasetIsLoading, selectDatasetFromMutations, selectIsLinked, selectWorkingDatasetName, selectWorkingDatasetUsername, selectWorkingStatusInfo } from '../../../selections'
// import { writeDataset } from '../../../actions/workbench'
// import { connectComponentToProps } from '../../../utils/connectComponentToProps'

const DEBOUNCE_TIMER = 1000

export interface ReadmeEditorProps {
  qriRef: QriRef
  data?: string
  loading?: boolean
  isLinked?: boolean
  statusInfo?: StatusInfo
  onDatasetChange: (field: string[], value: any) => void
}

const passEventToOpenExternal = (e: MouseEvent) => { 
  // openExternal(e, e.target.href)
}

function uriSafeBase64String (s: string): string {
  return btoa(unescape(encodeURIComponent(s)))
}

export const ReadmeEditor: React.FC<ReadmeEditorProps> = ({
  qriRef,
  data = '',
  loading = false,
  isLinked = false,
  statusInfo = {},
  onDatasetChange
}) => {
  const [internalValue, setInternalValue] = useState(data)
  const [listenerAdded, setListenerAdded] = useState(false)
  const [debouncedValue] = useDebounce(internalValue, DEBOUNCE_TIMER)

  useEffect(() => {
    setInternalValue(data)
  }, [data])
  
  // const onFocus = () => { setInternalValue(data) }
  // useEffect(() => {
  //   window.addEventListener('focus', onFocus)
  //   return () => { window.removeEventListener('focus', onFocus) }
  // })

  useEffect(() => {
    if (debouncedValue !== data) {
      write(qriRef.username, qriRef.name, {
        readme: internalValue
      })
    }
  }, [debouncedValue, data, internalValue, qriRef.username, qriRef.name])

  const handleChange = (value: string) => { setInternalValue(value) }


  /**
   * TODO (ramfox): this func is getting to the point where it probably should
   * live outside of this component, however, I'm not sure where it should live
   * and am leaning on the side of leaving it here until it is clearer whether
   * ephemeral fetches should be pulled out into their own file or if they
   * are okay living where they work
   */
  const getPreview = (plainText: string, preview: HTMLElement) => {
    if (!listenerAdded) {
      preview.addEventListener('click', passEventToOpenExternal)
      setListenerAdded(true)
    }

    if (isLinked) {
      // fetch(`${API_BASE_URL}/render/${refStringFromQriRef(qriRef)}?fsi=true`)
      //   .then(async (res) => res.text())
      //   .then((render) => {
      //     preview.innerHTML = render
      //   })
    } else {
      let d = NewDataset({})
      d.readme = NewReadme({
        scriptBytes: uriSafeBase64String(plainText)
      })

      fetch(`${API_BASE_URL}/render`, {
        method: 'post',
        body: JSON.stringify(d),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(async (res) => res.text())
        .then((render) => {
          preview.innerHTML = render
        })
    }
    return 'Loading...'
  }

  if (loading) {
    return <Spinner />
  }
  if (hasParseError(statusInfo)) {
    return <ParseFileError component='readme' />
  }

  return (
    <SimpleMDE
      id="readme-editor"
      value={internalValue}
      onChange={handleChange}
      options={{
        spellChecker: false,
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
        placeholder: 'Start writing your readme here',
        previewRender: getPreview
      }}
    />
  )
}

export default ReadmeEditor
