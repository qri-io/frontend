import React from 'react'

import IconLink from './IconLink'

interface ContentBoxTitleProps {
  title: string
  editLink?: string
  editTitle?: string
}

const ContentBoxTitle: React.FC<ContentBoxTitleProps> = ({
  title,
  editLink = '',
  editTitle = ''
}) => (
  <div className='flex'>
    <div className='text-sm text-qrigray-400 font-semibold mb-2 flex-grow'>{title}</div>
    {editLink !== '' && <IconLink icon='edit' size='xs' colorClassName='text-qrigray-400' to={editLink} title={editTitle} />}
  </div>
)

export default ContentBoxTitle
