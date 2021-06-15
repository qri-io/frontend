import React from 'react'
import { Structure, Body } from '../../../qri/dataset'
import { SimpleTable } from './SimpleTable'

export interface BodyDisplayProps {
  structure?: Structure
  body?: Body
}

export const BodyDisplay: React.FC<BodyDisplayProps> = ({ structure, body }) => {
  if (!structure || !body) {
    return null
  }

  return <div>
    { structure.format !== 'csv'
      ? <pre className='p-4'>{JSON.stringify(body, null, 2)}</pre>
      : <SimpleTable structure={structure} body={body} />
    }
    <div className='text-right text-xs p-2'>Preview of first 10 rows</div>
  </div>
}
