import React from 'react'

interface ContentBoxTitleProps {
  title: string
}

const ContentBoxTitle: React.FC<ContentBoxTitleProps> = ({
  title
}) => (
  <div className='text-sm text-qrigray-400 font-semibold mb-2'>{title}</div>
)

export default ContentBoxTitle
