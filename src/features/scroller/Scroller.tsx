import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectScrollerPos } from './state/scrollerState'
import { resetScroller } from './state/scrollerActions'

export interface ScrollerProps {
  // optional className to pass in styling
  className?: string
}

// The Scroller component is the component that actually gets scrolled
// The `ScrollElement`s must be inside this component
// When the `ScrollTrigger` is clicked, it updates the state to show which
// element should be scrolled to
// The `ScrollElement` will pick up on that change & if it is the correct
// element, will update the state to say where it should be positioned
// The `Scroller` will pick up on that position change and `scrollTo` the
// given position
const Scroller: React.FC<ScrollerProps> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const pos = useSelector(selectScrollerPos)
  const dispatch = useDispatch()

  // scroll when scrollerPos changes
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: pos, behavior: 'smooth' })
    }
  }, [pos])

  // when this instance of Scroller goes away, reset the scroller state
  useEffect(() => {
    return () => {
      dispatch(resetScroller())
    }
  }, [dispatch])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default Scroller
