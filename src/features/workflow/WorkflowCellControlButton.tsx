import React from "react";
import Icon from "../../chrome/Icon";

interface WorkflowCellControlButtonProps {
  onClick: () => void
  label: string
  icon: string
  flipIcon?: boolean
}

const WorkflowCellControlButton: React.FC<WorkflowCellControlButtonProps> = ({
  onClick,
  label,
  icon,
  flipIcon=false
 }) => {

  return (
    <button
      className='flex items-center text-xs h-5 mt-2.5 focus:outline-none'
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
