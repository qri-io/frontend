import React from 'react'

import { Structure } from '../../../qri/dataset'
import { formatConfigOptions } from './Structure'

export interface FormatConfigProps {
  structure: Structure
  showTrueOptionsOnly: boolean
}

const FormatConfig: React.FunctionComponent<FormatConfigProps> = ({
  structure,
  showTrueOptionsOnly
}) => {
  // if we are displaying a structure from a moment in history
  // only show the config options that were set to true
  const format = structure.format
  const formatConfig = structure.formatConfig

  let content = (
    (formatConfig === undefined || formatConfig === null || Object.keys(formatConfig).length === 0)
      ? <div className='margin'>No configurations details</div>
      : Object.keys(formatConfigOptions).map((option: string, i) => {
        if (option in formatConfig) {
          switch (formatConfigOptions[option].type) {
            case 'boolean':
              return formatConfig[option] && <div id={`structure-${option}`} key={`structure_${i}`} className='config-item margin-bottom'>{formatConfigOptions[option].label}</div>
            case 'string':
              return <div key={`structure_${i}`} id={`structure-${option}`} className='config-item margin-bottom'>{formatConfigOptions[option].label}: {formatConfig[option]}</div>
          }
        }
        return undefined
      })
  )

  // TODO(chriswhong): if rendering outside of history view (showTrueOptionsOnly is false), show a different layout
  // if (!showTrueOptionsOnly) {
  //   content = (...)
  // }

  return (
    <div className='text-left'>
      <div className='text-black text-sm font-semibold mb-2'>
        {format ? format.toUpperCase() + ' ' : ''}Configuration
      </div>
      <div className='font-normal text-sm text-qrigray-400'>
        {content}
      </div>
    </div>
  )
}

export default FormatConfig
