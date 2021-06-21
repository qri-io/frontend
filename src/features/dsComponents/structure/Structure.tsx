import React from 'react'

import { Structure } from '../../../qri/dataset'
import LabeledStats from '../../../chrome/LabeledStats'
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
    <div className='h-full w-full overflow-x-hidden px-4 pb-4'>
      <LabeledStats data={data} size='lg' />
      <Schema
        data={schema}
        editable={false}
      />
    </div>
  )
}

export default StructureComponent
