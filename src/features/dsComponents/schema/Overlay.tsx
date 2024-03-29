/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useCallback } from 'react'
import classNames from 'classnames'

import IconButton from '../../../chrome/IconButton'

interface OverlayProps {
  title?: string
  onCancel: () => void
  open: boolean
  height: number
  width: number
  navigation?: JSX.Element
}

const Overlay: React.FunctionComponent<OverlayProps> = ({
  height,
  width,
  title,
  onCancel,
  open,
  children,
  navigation
}) => {
  const overlayRef = React.useRef<HTMLDivElement>(null)

  const isInOverlay = useCallback((e: MouseEvent) => {
    if (!onCancel || !overlayRef || !overlayRef.current) return

    // figure out if the user clicking inside the overlay
    const rect = overlayRef.current?.getBoundingClientRect()

    // http://stackoverflow.com/a/26984690/2114
    const isIn =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width

    if (!isIn) {
      e.stopPropagation()
      onCancel()
    }
  }, [onCancel, overlayRef])

  React.useEffect(() => {
    if (open) {
      window.addEventListener('click', isInOverlay)
    } else {
      window.removeEventListener('click', isInOverlay)
    }
    return () => (
      window.removeEventListener('click', isInOverlay)
    )
  }, [open, isInOverlay])

  return (
    <div
      style={{ maxHeight: height, maxWidth: width }}
      className={classNames('radius relative flex flex-col bg-white', { 'hidden': !open })}
      ref={overlayRef}
    >
      {title && <div className='title-bar'>
        <div className='label x-small'>{title}</div>
        <IconButton icon='close' size='xs' onClick={onCancel}/>
      </div>}
      {navigation && <div className='nav'>{navigation}</div>}
      <div className='content'>{children}</div>
    </div>
  )
}

export default Overlay
