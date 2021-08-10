import React from 'react'

import Overlay from './Overlay'
import { typesAndDescriptions } from './TypePicker'
import DataType from '../../../chrome/DataType'
import Icon from '../../../chrome/Icon'

interface TypePickerOverlayProps {
  // function to close the picker
  onCancel: () => void
  // function called when a data type is selected
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  // function called when a tab is selected
  onTabClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  // type or types that are currently selected
  value: string | string[]
  // is the overlay open?
  open: boolean
  // navigation component, if it exists
  navigation?: JSX.Element
}

const TypePickerOverlay: React.FunctionComponent<TypePickerOverlayProps> = ({
  onCancel,
  onClick,
  value,
  navigation,
  open = true
}) => {
  const handleOnClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    onClick(e)
  }
  return (
    <Overlay
      title='data type'
      onCancel={onCancel}
      width={220}
      height={200}
      open={open}
      navigation={navigation}
    >
      {typesAndDescriptions.map((item, i) => {
        return (
          <div
            key={i}
            className='type-picker-overlay-row'
            onClick={handleOnClick}
            data-value={item.type}
          >
            <div className='icon-wrap'><Icon
              icon='check'
              size='xs'
              color={
                (typeof value === 'string' && value === item.type) || (Array.isArray(value) && value.includes(item.type)) ? 'dark' : 'light'}/>
            </div>
            <DataType type={item.type} />
          </div>
        )
      })}
    </Overlay>
  )
}

export default TypePickerOverlay
