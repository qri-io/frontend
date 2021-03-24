import React from 'react'

import { scriptFromTransform, Transform } from '../../../qri/dataset'
import Code from '../Code'

export interface TransformProps {
  data: Transform
}

export const TransformComponent: React.FunctionComponent<TransformProps> = ({ 
  data
}) => (
  <div className='pb-8 pt-5'>
    <Code data={scriptFromTransform(data)} />
  </div>
)

export default TransformComponent
