import classNames from 'classnames'
import React from 'react'
import { Structure } from '../../../qri/dataset'
import { BodyDisplayProps } from './BodyDisplay'

interface Header {
  title: string
  type: string
}

function headersFromStructure(structure: Structure): Header[] | undefined {
  if (!(structure.schema && structure.schema.items && structure.schema.items.items)) {
    return
  }
  return structure.schema.items.items
}

export const SimpleTable: React.FC<BodyDisplayProps> = ({ structure, body }) => {
  if (!structure || !body) {
    return null
  }
  let headers = headersFromStructure(structure)
  if (!headers) {
    return null
  }

  headers = [{"title":"", "type": ""}].concat(headers)
  return <div className='max-h-100 border-ts'>
    <table className='table-auto border-collapse relative text-left bg-white'>
      <thead>
        <tr>
          {headers.map((header: Header, i: number) => ( 
            <th className='border-b border-l border-r p-2 whitespace-nowrap sticky top-0 shadow text-xs' key={i}>{header.title}</th>
          ))}
        </tr>
      </thead>
      <tbody className='text-xs border'>
        {body.map((row: any[], i: number) => (
          <tr key={i} className={classNames((i % 2 === 0) && 'bg-gray-100')}>
            <td className='text-center px-2 py-1'>{i+1}</td>
            {row.map((el: any, j: number) => (
              <td className='px-2 py-1 whitespace-nowrap' key={j}>{el}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}
