import React from 'react';

export interface TooltipContentProps {
  text: string,
  subtext?: string
}


const TooltipContent: React.FC<TooltipContentProps> = ({ text, subtext }) => (
  <div className='text-left' style={{ maxWidth: '140px'}}>
    <div className='font-semibold text-sm mb-1'>{text}</div>
    <div className='font-semibold text-xs text-gray-400'>{subtext}</div>
  </div>
)

export default TooltipContent
