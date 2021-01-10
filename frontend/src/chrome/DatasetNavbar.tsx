import React from 'react';
import { Link } from 'react-router-dom'
import { QriRef } from '../qri/ref';

export interface DatasetNavBarProps {
  ref?: QriRef
}

const defaultRef:QriRef = {
  username: 'user',
  name: 'dataset'
} 

const DatasetNavBar: React.FC<DatasetNavBarProps> = ({ ref = defaultRef }) => {
  return (
    <div className='bg-gray-200 text-bold flex p-2'>
      <h2>{ref.username}</h2>
      <h1>{ref.name}</h1>
      <div>
        <Link to='/datasets/workflow'>Workflow</Link>
        <Link to='/datasets/components'>Compoennts</Link>
        <Link to='/datasets/history'>History</Link>
      </div>
    </div>
  )
}

export default DatasetNavBar
