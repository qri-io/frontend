import React from 'react'
import { useDispatch } from "react-redux"

import { setScrollAnchor } from "./state/scrollerActions"
import { trackGoal } from '../../features/analytics/analytics'

export interface ScrollTriggerProps {
  // the id of the component this trigger will cause the
  // app to scroll to
  target: string
}

// `ScrollTrigger` name must match the name of the associated `ScrollElement`
// When clicked, it will set the `scrollElement` that the `Scroller` should scroll to
// After setting the `scrollElement` it will follow up by clearing the scroll element
// As the mechanisms for showing and tracking scroll location are not tied to this
// system, we need to be able to click the same trigger twice in a row, after
// scrolling in between, and still activate the trigger
const ScrollTrigger: React.FC<ScrollTriggerProps> = ({ target, children }) => {
  const dispatch = useDispatch()
  return <div
    className='hover:cursor-pointer'
    onClick={() => {
      // workflow-click-outline event
      trackGoal('5LPYSXDH', 0)
      new Promise(() => {
        dispatch(setScrollAnchor(target))
      }).then(() =>
        dispatch(setScrollAnchor(''))
      )
    }}>
    {children}
  </div>
}

export default ScrollTrigger
