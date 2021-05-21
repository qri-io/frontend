import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import useDimensions from 'react-use-dimensions'

import { selectDataset, selectIsDatasetLoading } from '../dataset/state/datasetState'
import DatasetComponent from '../dsComponents/DatasetComponent'
import Spinner from '../../chrome/Spinner'
import ContentBox from '../../chrome/ContentBox'
import Icon from '../../chrome/Icon'
import ContentBoxTitle from '../../chrome/ContentBoxTitle'
import DownloadDatasetButton from '../download/DownloadDatasetButton'
import RelativeTimestampWithIcon from '../../chrome/RelativeTimestampWithIcon'
import UsernameWithIcon from '../../chrome/UsernameWithIcon'
import BodyPreview from '../dsComponents/body/BodyPreview'
import DatasetHeader from '../dataset/DatasetHeader'
import NavBar from '../navbar/NavBar'
import DatasetNavSidebar from '../dataset/DatasetNavSidebar'
import DeployingScreen from '../deploy/DeployingScreen'
import commitishFromPath from '../../utils/commitishFromPath'

import { selectSessionUserCanEditDataset } from '../dataset/state/datasetState';
import { QriRef } from '../../qri/ref'

interface DatasetPreviewPageProps {
  qriRef: QriRef
}

const DatasetPreviewPage: React.FC<DatasetPreviewPageProps> = ({
  qriRef
}) => {
  const dataset = useSelector(selectDataset)
  const loading = useSelector(selectIsDatasetLoading)
  const editable = useSelector(selectSessionUserCanEditDataset)

  const [versionInfoContainer, { height: versionInfoContainerHeight }] = useDimensions();
  const [expandReadme, setExpandReadme] = useState(false)

  let readmeContainerHeight = versionInfoContainerHeight || 'auto'

  if (expandReadme) {
    readmeContainerHeight = 'auto'
  }

  return (
    <div className='flex flex-col h-full w-full bg-qrigray-100'>
      <NavBar />
      <div className='flex overflow-hidden w-full'>
        <DatasetNavSidebar qriRef={qriRef} />
        {loading
        ? (<div className='w-full h-full p-4 flex justify-center items-center'>
            <Spinner color='#4FC7F3' />
          </div>)
        : (
          <div className='overflow-y-scroll overflow-x-hidden flex-grow relative flex'>
            <div className='max-w-screen-lg mx-auto py-9 flex-grow'>
              <DatasetHeader qriRef={qriRef} editable={editable} noBorder />
              <div className='-ml-2 -mr-3 mb-5'>
                <div className='w-7/12 px-2 inline-block align-top' style={{ height: readmeContainerHeight}}>
                  <ContentBox className='flex flex-col h-full'>
                    <ContentBoxTitle title='Readme'/>
                    <div className='flex-grow overflow-hidden'>
                      <DatasetComponent
                        key='readme'
                        componentName={'readme'}
                        dataset={dataset}
                      />
                    </div>
                    {!expandReadme && (<div className='text-qriblue text-sm cursor-pointer' onClick={() => { setExpandReadme(true) }}>See More</div>)}
                  </ContentBox>
                </div>
                <div ref={versionInfoContainer} className='w-5/12 px-3 inline-block align-top'>
                  <ContentBox>
                    <div className='flex items-center border-b pb-4'>
                      <div className='flex-grow'>
                        <ContentBoxTitle title='Version Info' />
                        <div className='text-qrinavy text-sm flex items-center mb-0'>
                          <Icon icon='commit' size='sm' className='-ml-2' />
                          <div className='font-medium'>{commitishFromPath(dataset.path)}</div>
                        </div>
                        <div className='text-sm text-qrinavy mb-2'>{dataset.commit && dataset.commit.title}</div>
                        <div className='flex items-center text-gray-400'>
                          <RelativeTimestampWithIcon timestamp={new Date(dataset.commit && dataset.commit.timestamp)} className='mr-3' />
                          <UsernameWithIcon username='chriswhong' className='mt-0.5' />
                        </div>
                      </div>
                      <DownloadDatasetButton qriRef={qriRef} small/>
                    </div>
                    {/* Bottom of the box */}

                    {dataset.meta && dataset.meta.description && (
                      <div className='pt-4 text-gray-400 text-xs tracking-wider mb-2'>{dataset.meta.description}</div>
                    )}

                    {dataset.meta && dataset.meta.keywords && dataset.meta.keywords.map((keyword) => {
                      return <div key={keyword} className='leading-tight text-gray-400 text-xs tracking-wider inline-block border border-qrigray-400 rounded-md px-2 py-1 mr-2'>{keyword}</div>
                    })}
                  </ContentBox>
                </div>
              </div>
              <ContentBox className='h-full flex flex-col'>
                <ContentBoxTitle title='Data' />
                <div className='flex-grow overflow-hidden relative'>
                  <BodyPreview dataset={dataset} />
                </div>
              </ContentBox>
              {/* bottom padding */}
              <div className='pb-5 h-0'>&nbsp;</div>
              </div>
            </div>
          )}
        <DeployingScreen qriRef={qriRef} />
      </div>
    </div>
  )
}

export default DatasetPreviewPage
