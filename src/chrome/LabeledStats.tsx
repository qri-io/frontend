import React from 'react'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

import Icon from './Icon'
import FormatConfig from '../features/dsComponents/structure/FormatConfig'
import fileSize, { abbreviateNumber } from '../utils/fileSize'
import { Structure, getStats } from '../qri/dataset'

export interface LabeledStatsProps {
  data: Structure
  // default is dark
  color?: 'light' | 'dark'
  // default sm
  size?: 'sm' | 'lg'
  // uppercase refers to the styling found in the label portion of the LabeledStat
  // defaults to true
  uppercase?: boolean
}

const LabeledStats: React.FC<LabeledStatsProps> = ({
  data,
  color = 'dark',
  size = 'sm'
}) => {
  const stats = getStats(data)
  return (
    <div className='stats-values border border-qrigray-200 rounded-lg grid grid-cols-5 w-full mb-6'>
      {stats.map((stat, i) => {
        let displayVal: any = stat.value
        let displayDelta: any = stat.delta
        if (typeof displayVal === 'number') {
          if (stat.inBytes) {
            displayVal = fileSize(displayVal)
            // fileSize will return 0 if the input is negative
            displayDelta = stat.delta && fileSize(Math.abs(stat.delta))
            if (typeof stat.delta === 'number' && stat.delta < 0) {
              displayDelta = `-${displayDelta}`
            }
          } else {
            displayVal = abbreviateNumber(stat.value)
            displayDelta = stat.delta && abbreviateNumber(displayDelta)
          }
        }
        return (
          <div key={i} className={classNames('stats-value text-center py-1.5 border-r last:border-r-0', { 'large': size === 'lg' })} >
            <div className={classNames('text-xs text-qrigray-400 capitalize', { 'light': color === 'light', 'large': size === 'lg' })}>
              {stat.label}
            </div>
            <div className={classNames('font-semibold text-black flex justify-center items-center', { 'light': color === 'light', 'large': size === 'lg' })}>
              {displayVal}
              {(stat.value === 'CSV') && (
                <div className='relative'>
                  <div className='flex' data-tip data-for={stat.label}>
                    <Icon icon='info' size='sm' className='text-qritile ml-2'/>
                  </div>
                  {/* TODO(chriswhong): this renders a light tooltip with gray border and shadow that resembles our dropdown menus, and should be componentized for re-use */}
                  <ReactTooltip
                    id={stat.label}
                    place='bottom'
                    effect='solid'
                    arrowColor='transparent'
                    className='light-tooltip'
                    offset={{
                      top: 5,
                      right: 170
                    }}
                    getContent={() => <FormatConfig structure={data} showTrueOptionsOnly />}
                  />

                </div>
              )}
            </div>
            {stat.delta
              ? <div className={classNames('delta', { 'negative': stat.delta < 0, 'light': color === 'light', 'large': size === 'lg' })}>{stat.delta > 0 && <span>+</span>}{displayDelta}</div>
              : <div className={classNames('delta-spacer', { 'large': size === 'lg' })}></div>}
          </div>
        )
      })}
    </div>
  )
}

export default LabeledStats
