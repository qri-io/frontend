import React, { useCallback, useEffect } from 'react'

import { QriRef } from '../../../qri/ref'
import { API_BASE_URL } from '../../../store/api'

export interface ReadmeProps {
  qriRef: QriRef
}

export const ReadmeComponent: React.FunctionComponent<ReadmeProps> = (props) => {
  const { qriRef } = props
  const [hasReadme, setHasReadme] = React.useState(true)

  const refCallback = useCallback((el: HTMLDivElement) =>{
    if (el !== null) {
      fetch(`${API_BASE_URL}/dataset_summary/readme?path=${qriRef.path}`)
        .then((res) => {
          if (res.ok) {
            return res.text()
          } else {
            return Promise.reject('error 404')
          }
        })
        .then((renderedReadme) => {
          el.innerHTML = renderedReadme
        })
        .catch((e) => {
          setHasReadme(false)
        })
    }
  }, [qriRef.path])

  if (!hasReadme) {
    return (
      <div className='h-full w-full flex items-center'>
        <div className='text-center mx-auto text-sm'>
          Error fetching readme
        </div>
      </div>
    )
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
