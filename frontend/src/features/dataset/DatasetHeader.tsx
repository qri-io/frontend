import React from 'react';
import { Link } from 'react-router-dom';
import { QriRef } from '../../qri/ref';
import { pathToActivityFeed, pathToDatasetViewer, pathToWorkflowEditor } from './state/datasetPaths';

export interface DatasetHeaderProps {
  qriRef: QriRef
}

const DatasetHeader: React.FC<DatasetHeaderProps> = ({ qriRef }) => {
  return (
    <header className='container mx-auto pt-5 text-left'>
      <div className='text-left'>
        <h3 className='text-xl'>{qriRef.username}/</h3>
        <h1 className='text-3xl font-bold'>{qriRef.name}</h1>
      </div>
      <div className='flex my-1'>
        {[
          { name: 'Workflow', link: pathToWorkflowEditor(qriRef.username, qriRef.name) },
          { name: 'Components', link: pathToDatasetViewer(qriRef.username, qriRef.name) },
          { name: 'History', link: pathToActivityFeed(qriRef.username, qriRef.name) },
        ].map((d, i) => (
          <Link key={i} className='my-2 mr-5' to={d.link}>{d.name}</Link>
        ))}
      </div>
      <hr className='border-solid border-gray-200' />
    </header>
  )
}

export default DatasetHeader;
