import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setScrollerPos } from './state/scrollerActions'
import { selectScrollElement } from './state/scrollerState'

// SCROLLER_TOP_OFFSET how far from the top of the scroller
// to place element
const SCROLLER_TOP_OFFSET = 180

interface ScrollElementProps {
  // name of this element, must be unique
  name: string
  // scrollOffset is how many pixels from the top of the scroller
  // the ScrollElement will be placed
  // optional: defaults to `SCROLLER_TOP_OFFSET`
  scrollOffset?: number
}

// The `ScrollElement` component must exist as a child of the `Scroller` component
// (it does not have to be a direct child)
// When the `selectedScrollElement` changes, if it is equal to the given `name`
// for this element, it will set the `scrollPos` state to the given location
// The `name` must be unique
const ScrollElement: React.FC<ScrollElementProps> = ({
  name, 
  scrollOffset = SCROLLER_TOP_OFFSET, 
  children
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const selectedScrollElement = useSelector(selectScrollElement)

  useEffect(() => {
    if (selectedScrollElement === name && ref && ref.current) {
      const scrollerPos = ref.current.offsetTop - scrollOffset > 0 ? ref.current.offsetTop - scrollOffset : 0
      dispatch(setScrollerPos(scrollerPos))
    }
  }, [selectedScrollElement, dispatch, name, scrollOffset])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}

export default ScrollElement