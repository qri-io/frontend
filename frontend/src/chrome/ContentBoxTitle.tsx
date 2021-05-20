import React from 'react'

interface ContentBoxTitleProps {
  title: string
}

const ContentBoxTitle: React.FC<ContentBoxTitleProps> = ({
  title
}) => (
  <div className='text-xs text-gray-400 font-medium mb-2'>{title}</div>
)

export default ContentBoxTitle
