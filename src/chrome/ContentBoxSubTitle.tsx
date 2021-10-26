import React from 'react'

interface ContentBoxSubTitleProps {
  title: string
}

const ContentBoxSubTitle: React.FC<ContentBoxSubTitleProps> = ({
  title
}) => (
  <div className='text-xs text-black font-semibold mb-2'>{title}</div>
)

export default ContentBoxSubTitle
