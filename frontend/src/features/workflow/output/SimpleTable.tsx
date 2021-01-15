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
  return <div className='overflow-auto max-h-100 border-t'>
    <table className='table-auto border-collapse relative'>
      <thead>
        <tr>
          {headers.map((header: Header, i: number) => ( 
            <th className='border-b border-l border-r text-left p-2 whitespace-nowrap sticky top-0 bg-white shadow' key={i}>{header.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row: any[], i: number) => (
          <tr key={i}>
            <td className='border text-center p-2'>{i+1}</td>
            {row.map((el: any, j: number) => (
              <td className='border text-left p-2 whitespace-nowrap' key={j}>{el}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}
