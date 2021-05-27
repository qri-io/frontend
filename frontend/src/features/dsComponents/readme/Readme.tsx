import React, { useCallback } from 'react'

import { refStringFromQriRef, QriRef } from '../../../qri/ref'
import { API_BASE_URL } from '../../../store/api'

export interface ReadmeProps {
  qriRef: QriRef
}

export const ReadmeComponent: React.FunctionComponent<ReadmeProps> = (props) => {
  const { qriRef } = props
  const [hasReadme, setHasReadme] = React.useState(true)

  const qriRefStr = refStringFromQriRef(qriRef)

  const refCallback = useCallback((el: HTMLDivElement) =>{
    if (el !== null) {
      fetch(`${API_BASE_URL}/dataset_summary/readme?path=${qriRef.path}`)
        .then(async (res) => {
          return res.text()
        })
        .then((render) => {
          if (!render) { setHasReadme(false) }
          el.innerHTML = render
        })

      const render = "<h1>Heading</h1><p>Lorem Ipsum Dolor</p><p><strong>bold text</strong></p><h2>Heading 2</h2>"
      el.innerHTML = render
    }
  }, [qriRefStr])

  if (!hasReadme) {
    return null
  }
  return (
    <div className='h-full w-full'>
      <div
        // use "editor-preview" class to piggie-back off the simplemde styling
        className="markdown-body"
        ref={refCallback}
      >loading...
      </div>
    </div>
  )
}

// TODO (b5) - this doesn't need to be a container at all
export default ReadmeComponent
