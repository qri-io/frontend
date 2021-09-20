import React from "react";
import Icon from "../../chrome/Icon";

interface WorkflowCellControlButtonProps {
  onClick: () => void
  label: string
  icon: string
  rotate?: boolean
}

const WorkflowCellControlButton: React.FC<WorkflowCellControlButtonProps> = ({
  onClick,
  label,
  icon,
  rotate
 }) => {

  return (
    <button
      className='flex items-center text-xs h-5 mt-2.5 focus:outline-none'
      onClick={onClick}>
      <Icon
        className='mr-2'
        rotation={rotate ? 180 : undefined}
        size='2xs'
        icon={icon}/>
        {label}
    </button>
  )
}

export default WorkflowCellControlButton;
