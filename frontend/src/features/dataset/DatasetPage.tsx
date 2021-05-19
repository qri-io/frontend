import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import NavBar from '../navbar/NavBar';
import { newQriRef } from '../../qri/ref';
import { loadDataset } from './state/datasetActions'
import DatasetNavSidebar from './DatasetNavSidebar';
import { selectSessionUser } from '../session/state/sessionState';
import { selectSessionUserCanEditDataset } from './state/datasetState';
import DatasetHeader from './DatasetHeader';
import DeployingScreen from '../deploy/DeployingScreen'


const DatasetPage: React.FC<{}> = ({
  children
}) => {
  const qriRef = newQriRef(useParams())
  const user = useSelector(selectSessionUser)
  const editable = useSelector(selectSessionUserCanEditDataset)
  const dispatch = useDispatch()
  const isNew = (qriRef.username === 'new')

  // This covers the case where a user created a new workflow before logging in.
  // If they login while working on the workflow, the `user` will change, but the
  // params used to generate the `qriRef` will not (because they are generated
  // from the url, which has not changed). This check ensures that the correct
  // username is propagated after login/signup.
  if (isNew) {
    qriRef.username = user.username
  }

  useEffect(() => {
    if (isNew) { return }
    const ref = newQriRef({username: qriRef.username, name: qriRef.name, path: qriRef.path})
    dispatch(loadDataset(ref))
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path, isNew])

  return (
    <div className='flex flex-col h-full w-full' style={{ backgroundColor: '#f3f4f6'}}>
      <NavBar />
      <div className='flex overflow-hidden w-full'>
        <DatasetNavSidebar qriRef={qriRef} />
        <div className='flex flex-col flex-grow overflow-hidden'>
          <DatasetHeader qriRef={qriRef} editable={editable} />
          {children}
        </div>
        <DeployingScreen qriRef={qriRef} />
      </div>
    </div>
  )
}

export default DatasetPage
