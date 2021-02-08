import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import { Structure } from '../../../qri/dataset'

import fileSize, { abbreviateNumber } from '../fileSize'

import LabeledStats from '../LabeledStats'
import FormatConfigHistory from '../FormatConfigHistory'
// import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import Schema from '../schema/Schema'

export interface StructureProps {
  data?: Structure
  // showConfig?: boolean
  // loading: boolean
}

export interface FormatConfigOption {
  label: string
  tooltip: string
  type: string
}

export const formatConfigOptions: { [key: string]: FormatConfigOption } = {
  headerRow: {
    label: 'This table contains a header row',
    tooltip: 'If the the first row of the table IS the row containing all the column names, check this input',
    type: 'boolean'
  },
  variadicFields: {
    label: 'This table has rows with different lengths',
    tooltip: 'If your table has rows that have different numbers of entries in each row, check this input',
    type: 'boolean'
  },
  lazyQuotes: {
    label: 'This table uses different quotes to indicate strings',
    tooltip: 'If your table sometime uses double quotes, sometimes uses single quotes, or sometimes doesn\'t use quotes at all, check this input',
    type: 'boolean'
  },
  // TODO (ramfox): the juice isn't worth the squeeze for this one quite yet
  // let's wait until someone yells at us about not being able to use a csv
  // with a separator other then ',' before we impliment
  // separator: {
  //   label: '',
  //   tooltip: '',
  //   type: 'rune'
  // },
  pretty: {
    label: 'Pretty-print JSON',
    tooltip: 'Check this box if you want your JSON to display formatted.',
    type: 'boolean'
  },
  sheetName: {
    label: 'Main sheet name:',
    tooltip: 'The name of the sheet that has the content that you want to be the focus of this dataset',
    type: 'string'
  }
}

export function getStats (data: Structure): any[] {
  return [
    { 'label': 'format', 'value': data.format ? data.format.toUpperCase() : 'unknown' },
    { 'label': 'body size', 'value': data.length ? fileSize(data.length) : '—' },
    { 'label': 'entries', 'value': abbreviateNumber(data.entries) || '—' },
    { 'label': 'errors', 'value': data.errCount ? abbreviateNumber(data.errCount) : '—' },
    { 'label': 'depth', 'value': data.depth || '—' }
  ]
}

export const StructureComponent: React.FunctionComponent<StructureProps> = ({data}) => {

  if (!data) return null

  // if (loading) {
  //   return <SpinnerWithIcon loading />
  // }

  let schema
  if (data && data.schema) {
    schema = data.schema
  }

  return (
    <div>
      <div className='p-3'>
        <LabeledStats data={getStats(data)} size='lg' />
        <FormatConfigHistory structure={data} />
        <div>
          <div className='text-sm font-semibold mb-2'>
            Schema
            &nbsp;
            <a id='json-schema' href='https://json-schema.org/' target='_blank' rel='noreferrer'>
              <span
                data-tip={'JSON schema that describes the structure of the dataset. Click here to learn more about JSON schemas'}
                className='text-input-tooltip'
              >
                <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
              </span>
            </a>
          </div>
        </div>
      </div>
      <Schema
        data={schema}
        editable={false}
      />
    </div>
  )
}

export default StructureComponent
