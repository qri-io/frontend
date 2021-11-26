import React from 'react'
import Icon from '../../../chrome/Icon'

interface NoBodyProps {
  styles?: string
}
const NoBody: React.FC<NoBodyProps> = ({ styles }) => {
  return (<div className={`h-full w-full flex flex-col justify-center items-center border rounded-lg border-dangerred ${styles}`}>
    <Icon className='text-dangerred mb-2' icon="faceMeh" />
    <div>Seems that you don&apos;t have a body</div>
  </div>)
}

export default NoBody
