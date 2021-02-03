import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { selectScrollerPos } from './state/scrollerState'

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
const Scroller: React.FC<ScrollerProps> = ({className, children})=> {
  const ref = useRef<HTMLDivElement>(null)
  const pos = useSelector(selectScrollerPos)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({top: pos, behavior: 'smooth'})
    }
  }, [pos])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default Scroller
