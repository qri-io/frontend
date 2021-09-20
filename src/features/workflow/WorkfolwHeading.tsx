import React from "react";


interface WorkflowHeadingProps {
  title: string;
  onChange: (t: string) => void;
}

const WorkflowHeading: React.FC<WorkflowHeadingProps> = ({
  title,
  onChange
}) => {

 return (
   <input
     className={'w-full border-none outline-none'}
     autoFocus
     value={title}
     onChange={(e) => onChange(e.target.value)}
     type="text"/>)
}

export default WorkflowHeading
