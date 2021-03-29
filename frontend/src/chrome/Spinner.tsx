import React from 'react'
import { SyncLoader } from 'react-spinners'

export interface SpinnerProps {
  color?: string
  size?: number
}

const Spinner: React.FC<SpinnerProps> = ({ color, size }) => (
  <SyncLoader color={color} size={size} />
)

export default Spinner
