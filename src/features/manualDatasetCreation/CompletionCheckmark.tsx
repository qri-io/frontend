import React from "react"

interface CompletionChenckmarkProps {
  active: boolean
  className?: string
}

const CompletionCheckmark: React.FC<CompletionChenckmarkProps> = ({ active, className }) => {
  return (
    <div className={`${className} border rounded w-5 h-2 ${active ? 'border-qrigreen-600 bg-qrigreen-600' : 'border-qrigray-400'}`}/>
  )
}

export default CompletionCheckmark
