// @ts-nocheck
import React from 'react'

import { ApiActionThunk } from '../../../store/api'
import fileSize, { abbreviateNumber } from '../../../utils/fileSize'
import Spinner from '../../../chrome/Spinner'
import { QriRef } from '../../../qri/ref'
import { StatusInfo } from '../../../qri/status'
import { Structure } from '../../../qri/dataset'
import Icon from '../../../chrome/Icon'
import Link from '../../../chrome/Link'
import LabeledStats from '../../../chrome/LabeledStats'
import Schema from '../schema/Schema'

// import hasParseError from '../../../utils/hasParseError'
// import ParseFileError from '../../dsComponents/ParseFileError'

export interface StructureEditorProps {
  qriRef: QriRef
  data?: Structure
  showConfig?: boolean
  loading: boolean
  statusInfo?: StatusInfo
  write?: (peername: string, name: string, dataset: Dataset) => ApiActionThunk | void
}

export const StructureEditor: React.FC<StructureEditorProps> = ({
  data,
  write,
  loading,
  qriRef,
  statusInfo,
}) => {
  if (loading) {
    return <Spinner />
  }

  // if (hasParseError(statusInfo)) {
  //   return <ParseFileError component='structure' />
  // }

  if (!data) { return null }

  const username = qriRef.username || ''
  const name = qriRef.name || ''
  const format = data.format || 'csv'

  const handleWriteFormat = (option: string, value: any) => {
    if (!write) return
    // TODO (ramfox): sending over format since a user can replace the body with a body of a different
    // format. Let's pass in whatever the current format is, so that we have unity between
    // what the desktop is seeing and the backend. This can be removed when we have the fsi
    // backend codepaths settled
    write(username, name, { structure: {
      ...data,
      format,
      formatConfig: {
        ...data.formatConfig,
        [option]: value
      }
    } })
  }

  const handleOnChange = (schema: ISchema) => {
    if (write) write(username, name, { structure: { ...data, schema } })
  }

  const stats = [
    { 'label': 'format', 'value': data.format ? data.format.toUpperCase() : 'unknown' },
    { 'label': 'body size', 'value': data.length ? fileSize(data.length) : '—' },
    { 'label': 'entries', 'value': abbreviateNumber(data.entries) || '—' },
    { 'label': 'errors', 'value': data.errCount ? abbreviateNumber(data.errCount) : '—' },
    { 'label': 'depth', 'value': data.depth || '—' }
  ]

  return (
    <div className='structure'>
      <div className='stats'>
        <LabeledStats data={stats} size='lg' />
      </div>
      <FormatConfigEditor
        structure={data}
        format={format}
        write={handleWriteFormat}
      />
      <div>
        <h4 className='schema-title'>
          Schema
          &nbsp;
          <Link id='json-schema' href='https://json-schema.org/'>
            <span
              data-tip={'JSON schema that describes the structure of the dataset. Click here to learn more about JSON schemas'}
              className='text-input-tooltip'
            >
              <Icon icon='info' size='sm' />
            </span>
          </Link>
        </h4>
      </div>
      <Schema
        data={data.schema}
        onChange={handleOnChange}
        editable
      />
    </div>
  )
}

export default StructureEditor
