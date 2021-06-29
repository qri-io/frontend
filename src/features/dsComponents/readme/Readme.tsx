import React, { useCallback } from 'react'

import Dataset from '../../../qri/dataset'

export interface ReadmeProps {
  dataset: Dataset
}

export const ReadmeComponent: React.FC<ReadmeProps> = ({ dataset }) => {
  const readme = dataset.readme?.script
  const refCallback = useCallback((el: HTMLDivElement) =>{
    if (readme) {
      el.innerHTML = readme
    }
  }, [readme])

  if (!readme) {
    return (
      <div className='h-full w-full flex items-center'>
        <div className='text-center mx-auto text-sm text-qrigray-400'>
          no readme
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

export default ReadmeComponent
