import React, { useState } from 'react'
// import { useLocation, useParams, useRouteMatch } from 'react-router'

import Dataset, { ComponentName } from '../../qri/dataset'
// import { QriRef } from '../../qri/ref'
import ComponentList from './ComponentList'
// import ComponentRouter from './ComponentRouter'
// import DatasetHeader from './DatasetHeader'
// import DatasetLayout from './DatasetLayout'
// import Layout from './Layout'
// import LogList from './LogList'
import Resizable from '../../chrome/Resizable'
import DatasetComponent from './DatasetComponent'

// export interface DatasetProps extends RouteProps {
export interface DatasetProps {
  dataset: Dataset
  // isPublished: boolean
  // inNamespace: boolean
  // fsiPath: string
  // fetchWorkbench: (qriRef: QriRef) => LaunchedFetchesAction
  // setModal: (modal: Modal) => void
}

export const DatasetComponents: React.FC<DatasetProps> = ({
  dataset
  // isPublished,
  // fsiPath,
  // inNamespace,
  // fetchWorkbench,
  // setModal
}) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentName>('body')
  // const publishUnpublishDataset = () => {
  //   inNamespace && isPublished
  //     ? setModal({
  //       type: ModalType.UnpublishDataset,
  //       username: qriRef.username,
  //       name: qriRef.name
  //     })
  //     : setModal({
  //       type: ModalType.PublishDataset,
  //       username: qriRef.username,
  //       name: qriRef.name
  //     })
  // }

  // const openWorkingDirectory = () => {
  //   openDirectory(fsiPath)
  // }

  // React.useEffect(() => {
  //   addRendererListener('open-working-directory', openWorkingDirectory)

  //   return () => {
  //     removeRendererListener('open-working-directory', openWorkingDirectory)
  //   }
  // }, [fsiPath])

  // React.useEffect(() => {
  //   addRendererListener('publish-unpublish-dataset', publishUnpublishDataset)
  //   return () => {
  //     removeRendererListener('publish-unpublish-dataset', publishUnpublishDataset)
  //   }
  // }, [qriRef.username, qriRef.name])

  // React.useEffect(() => {
  //   fetchWorkbench(qriRef)
  // }, [qriRef.location])

  // return (
  //   <DatasetLayout
  //     id='dataset-history'
  //     mainContent={
  //       <div className='dataset-content transition-group'>
  //         <Layout
  //           showNav={false}
  //           id='commit-details'
  //           headerContent={
  //             <DatasetHeader
  //               path={qriRef.path || ''}
  //               structure={dataset.structure}
  //               commit={dataset.commit}
  //             />
  //           }
  //           sidebarContent={<ComponentList qriRef={qriRef}/>}
  //           sidebarWidth={150}
  //           mainContent={<h1>Oh Hello!</h1>}
  //           // mainContent={<ComponentRouter qriRef={qriRef}/>}
  //         />
  //       </div>}
  //     sidebarContent={<LogList qriRef={qriRef}/>}
  //   />
  // )
  return (
    <div className='flex h-full w-full overflow-hidden'>
      <ComponentList
        dataset={dataset}
        onClick={setSelectedComponent}
        selectedComponent={selectedComponent}
      />
      <DatasetComponent dataset={dataset} componentName={selectedComponent} />
    </div>
  )
}

export default DatasetComponents
