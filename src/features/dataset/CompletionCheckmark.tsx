import React from "react"

interface CompletionChenckmarkProps {
  type: 'green' | 'gray' | 'orange' | 'outline'
  className?: string
}

const CompletionCheckmark: React.FC<CompletionChenckmarkProps> = ({ type, className }) => {
  let typeClassName = ''
  switch (type) {
    case "green":
      typeClassName = 'border-qrigreen-600 bg-qrigreen-600'
      break
    case "gray":
      typeClassName = 'border-qrigray-400 bg-qrigray-400'
      break
    case "orange":
      typeClassName = 'border-qriorange-500 bg-qriorange-500'
      break
    case "outline":
      typeClassName = 'border-qrigray-400'
      break
  }
  return (
    <div className={`${className} border rounded w-5 h-2 ${typeClassName}`}/>
  )
}

export default CompletionCheckmark
