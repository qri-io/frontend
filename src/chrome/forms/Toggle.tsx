import React from "react"

interface ToggleProps {
  checked: boolean
  onClick: () => void
}
// TODO (boandriy): once there will be ability to add multiple triggers this component will be used to disable/enable triggers
const Toggle: React.FC<ToggleProps> = ({
  checked,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer w-6 h-3 rounded-xl ${checked ? 'bg-qritile' : 'bg-qrigray-200'}`}>
      <div
        className={`w-3 transition-all absolute h-3 border-2 bg-white rounded-xl ${checked
          ? 'border-qritile right-0'
: 'border-qrigray-200 right-3'}`}
      />
    </div>
  )
}

export default Toggle
