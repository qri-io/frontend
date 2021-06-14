import React from 'react'
import { Meta, standardFieldNames } from '../../../qri/dataset'

export interface CustomMetaEditorProps {
  data: Meta
  onDatasetChange: (field: string[], value: any) => void
}

const ignore = standardFieldNames.concat(['qri','path'])

const CustomMetaEditor: React.FC<CustomMetaEditorProps> = ({
  data,
  // TODO(b5) - implement editing
  onDatasetChange
}) => (
  <div className='metadata-viewer-table-wrap'>
    <table className='metadata-viewer-table'>
      <tbody>
        {Object.keys(data)
          .filter((key) => !ignore.includes(key))
          .map((key) => (
            <tr key={key} className='metadata-viewer-row'>
              <td className='metadata-viewer-key'>{key}</td>
              <td>
                {((value: string) => {
                  switch (typeof value) {
                    case 'string':
                    case 'number':
                      return <span>{value}</span>
                    case 'object':
                      return <span>{JSON.stringify(value)}</span>
                    default:
                      return <span>{JSON.stringify(value)}</span>
                  }
                })(data[key])}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)

export default CustomMetaEditor
