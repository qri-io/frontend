import React from 'react'
import { useDispatch } from "react-redux"
import { setScrollElement } from "./state/scrollerActions"

interface ScrollTriggerProps {
  // the name of the component this trigger will cause the 
  // app to scroll to
  name: string
}

// `ScrollTrigger` name must match the name of the associated `ScrollElement` 
// When clicked, it will set the `scrollElement` that the `Scroller` should scroll to
// After setting the `scrollElement` it will follow up by clearing the scroll element
// As the mechanisms for showing and tracking scroll location are not tied to this
// system, we need to be able to click the same trigger twice in a row, after 
// scrolling in between, and still activate the trigger
const ScrollTrigger: React.FC<ScrollTriggerProps> = ({ name, children }) => {
  const dispatch = useDispatch()
  return <div
    className='hover:cursor-pointer'
    onClick={() => {
      new Promise(() => {
        dispatch(setScrollElement(name))
      }).then (() =>
        dispatch(setScrollElement(''))
      )
    }}>
    {children}
  </div>
}

export default ScrollTrigger