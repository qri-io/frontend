import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setScrollerPos } from './state/scrollerActions'
import { selectScrollAnchorID, SCROLLER_DEFAULT_TOP_OFFSET } from './state/scrollerState'

export interface ScrollAnchorProps {
  // identifier for this element, must be unique
  id: string
  // scrollOffset is how many pixels from the top of the scroller
  // the ScrollAnchor will be placed
  // optional: defaults to `SCROLLER_TOP_OFFSET`
  scrollOffset?: number
}

// The `ScrollAnchor` component must exist as a child of the `Scroller` component
// (it does not have to be a direct child)
// When the `selectedScrollAnchorID` changes, if it is equal to the given `id`
// for this element, it will set the `scrollPos` state to the given location
// The `name` must be unique
const ScrollAnchor: React.FC<ScrollAnchorProps> = ({
  id, 
  scrollOffset = SCROLLER_DEFAULT_TOP_OFFSET,
  children
}) => {
  const ref = useRef<HTMLAnchorElement>(null)
  const dispatch = useDispatch()
  const selectedScrollAnchorID = useSelector(selectScrollAnchorID)

  useEffect(() => {
    if (selectedScrollAnchorID === id && ref && ref.current) {
      const scrollerPos = ref.current.offsetTop - scrollOffset > 0 ? ref.current.offsetTop - scrollOffset : 0
      dispatch(setScrollerPos(scrollerPos))
    }
  }, [selectedScrollAnchorID, dispatch, id, scrollOffset])

  return (
    <a id={id} href={`#${id}`} ref={ref}>
      {children}
    </a>
  )
}

export default ScrollAnchor
