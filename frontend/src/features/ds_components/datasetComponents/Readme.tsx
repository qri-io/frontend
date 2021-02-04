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
      fetch(`${API_BASE_URL}/render/${qriRefStr}`)
        .then(async (res) => {
          return res.text()
        })
        .then((render) => {
          if (!render) { setHasReadme(false) }
          el.innerHTML = render
        })
    }
  }, [qriRefStr])

  if (!hasReadme) {
    return null
  }
  return (
    <div
      // use "editor-preview" class to piggie-back off the simplemde styling
      className="editor-preview"
      ref={refCallback}
    >loading...
    </div>
  )
}

// TODO (b5) - this doesn't need to be a container at all
export default ReadmeComponent 