import React from 'react'

import { scriptFromTransform, Transform } from '../../../qri/dataset'
import Monospace from '../../../chrome/Monospace'

export interface TransformProps {
  data: Transform
}

export const TransformComponent: React.FunctionComponent<TransformProps> = ({ 
  data
}) => (
  <div className='pb-8 pt-5'>
    <Monospace data={scriptFromTransform(data)} />
  </div>
)

export default TransformComponent
