import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

interface UseIntersectProps {
  root?: HTMLElement | null
  rootMargin?: string
  threshold?: number | number[]
}

export const useIntersect = ({ root = null, rootMargin, threshold = 0}: UseIntersectProps): [Dispatch<SetStateAction<HTMLDivElement | null>>, IntersectionObserverEntry | undefined] => {
  const [entry, updateEntry] = useState<IntersectionObserverEntry>()
  const [node, setNode] = useState<HTMLDivElement | null>(null)

  const observer = useRef(
    new window.IntersectionObserver(
      ([entry]) => updateEntry(entry), 
      {
        root, 
        rootMargin, 
        threshold 
      }
    )
  )

  useEffect(() => {
    const { current: currentObserver } = observer
    currentObserver.disconnect()

    node && currentObserver.observe(node)
    return () => currentObserver.disconnect()
  }, [node, root, rootMargin, threshold])

  return [setNode, entry]
}

const IntersectionObserver: React.FC = ({children}) => {
  // figure out how to only trigger at the moment it crosses, not when it's still in 
  // the root margin
  // or figure out how to make the root margin v small
  const [ref, entry] = useIntersect({rootMargin: '-200px 0px 0px 0px'})
  useEffect(() => {
    console.log(entry)
  }, [entry])
  return <div className={`h-2 ${entry?.isIntersecting ? 'bg-black' : ''}`} ref={ref}>{children}</div>
}

export default IntersectionObserver