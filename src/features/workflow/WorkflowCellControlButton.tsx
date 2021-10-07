import React from "react";
import Icon from "../../chrome/Icon";

interface WorkflowCellControlButtonProps {
  onClick: () => void
  label: string
  icon: string
  flipIcon?: boolean
  disabled?: boolean
  id?: string
}

const WorkflowCellControlButton: React.FC<WorkflowCellControlButtonProps> = ({
  onClick,
  label,
  icon,
  flipIcon=false,
  disabled,
  id
 }) => {
  let classes = disabled ?  'text-qrigray-400 cursor-not-allowed' : 'hover:text-qripink-600'
  return (
    <button
      id={id}
      disabled={disabled}
      className={`flex items-center text-xs h-5 mt-2.5 focus:outline-none ${classes}`}
      onClick={onClick}>
      <Icon
        className='mr-2'
        rotation={flipIcon ? 180 : undefined}
        size='2xs'
        icon={icon}/>
        {label}
    </button>
  )
}

export default WorkflowCellControlButton;
