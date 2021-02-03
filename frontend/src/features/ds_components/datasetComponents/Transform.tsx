import React from 'react'
import { scriptFromTransform, Transform } from '../../../qri/dataset'

import Code from '../Code'
// import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'

export interface TransformProps {
  // qriRef: QriRef
  data?: Transform
  // loading: boolean

  // // TODO (b5) - work in progress
  // dryRun?: () => void
  // write?: (username: string, name: string, dataset: Dataset) => ApiActionThunk | void
}

export const TransformComponent: React.FunctionComponent<TransformProps> = ({ data }) => {
  if (!data) return null
  // if (loading) {
  //   return <SpinnerWithIcon loading />
  // }
  return <Code data={scriptFromTransform(data)} />
}

export default TransformComponent 