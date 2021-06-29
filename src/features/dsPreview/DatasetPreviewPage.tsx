import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useDimensions from 'react-use-dimensions'
import { useInView } from 'react-intersection-observer'

import { newQriRef } from '../../qri/ref';
import { selectDsPreview } from './state/dsPreviewState'
import { loadDsPreview } from './state/dsPreviewActions'
import Spinner from '../../chrome/Spinner'
import ContentBox from '../../chrome/ContentBox'
import Icon from '../../chrome/Icon'
import ContentBoxTitle from '../../chrome/ContentBoxTitle'
import DownloadDatasetButton from '../download/DownloadDatasetButton'
import RelativeTimestampWithIcon from '../../chrome/RelativeTimestampWithIcon'
import UsernameWithIcon from '../../chrome/UsernameWithIcon'
import BodyPreview from '../dsComponents/body/BodyPreview'
import DatasetHeader from '../dataset/DatasetHeader'
import DatasetMiniHeader from '../dataset/DatasetMiniHeader'
import NavBar from '../navbar/NavBar'
import DatasetNavSidebar from '../dataset/DatasetNavSidebar'
import DeployingScreen from '../deploy/DeployingScreen'
import commitishFromPath from '../../utils/commitishFromPath'
import Readme from '../dsComponents/readme/Readme'
import { selectSessionUserCanEditDataset } from '../dataset/state/datasetState'
import { QriRef } from '../../qri/ref'
import MetaChips from '../../chrome/MetaChips'

interface DatasetPreviewPageProps {
  qriRef: QriRef
}

const DatasetPreviewPage: React.FC<DatasetPreviewPageProps> = ({
  qriRef
}) => {
  const dispatch = useDispatch()
  const dataset = useSelector(selectDsPreview)
  const editable = useSelector(selectSessionUserCanEditDataset)

  const { ref: stickyHeaderTriggerRef, inView } = useInView({
    threshold: 0.6,
    initialInView: true
  });

  const [versionInfoContainer, { height: versionInfoContainerHeight }] = useDimensions();
  const [expandReadme, setExpandReadme] = useState(false)

  let readmeContainerHeight = versionInfoContainerHeight || 'auto'

  if (expandReadme) {
    readmeContainerHeight = 'auto'
  }

  useEffect(() => {
    const ref = newQriRef({username: qriRef.username, name: qriRef.name, path: qriRef.path})
    dispatch(loadDsPreview(ref))
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path ])

  return (
    <div className='flex flex-col h-full w-full bg-qrigray-100'>
      <NavBar />
      <div className='flex overflow-hidden w-full flex-grow'>
        <DatasetNavSidebar qriRef={qriRef} />
        {!dataset
        ? (<div className='w-full h-full p-4 flex justify-center items-center'>
            <Spinner color='#4FC7F3' />
          </div>)
        : (
          <div className='overflow-y-scroll overflow-x-hidden flex-grow relative'>
            <DatasetMiniHeader dataset={dataset} show={!inView} />
            <div className='max-w-screen-lg mx-auto p-7 w-full h-full'>
              <div ref={stickyHeaderTriggerRef}>
                <DatasetHeader dataset={dataset} editable={editable} noBorder />
              </div>
              <div className='-ml-2 -mr-3 mb-5'>
                <div className='w-7/12 px-2 inline-block align-top' style={{ height: readmeContainerHeight}}>
                  <ContentBox className='flex flex-col h-full'>
                    <ContentBoxTitle title='Readme'/>
                    <div className='flex-grow overflow-hidden'>
                      {
                        dataset.readme ? (
                          <Readme dataset={dataset} />
                        ) : (
                          <div className='h-full w-full flex items-center'>
                            <div className='text-center mx-auto text-sm'>
                              No Readme
                            </div>
                          </div>
                        )
                      }
                    </div>
                    {!expandReadme && (<div className='text-qriblue text-sm cursor-pointer mt-1' onClick={() => { setExpandReadme(true) }}>See More</div>)}
                  </ContentBox>
                </div>
                <div ref={versionInfoContainer} className='w-5/12 px-3 inline-block align-top'>
                  <ContentBox>
                    <div className='flex items-center border-b pb-4 mb-3'>
                      <div className='flex-grow truncate'>
                        <ContentBoxTitle title='Version Info' />
                        <div className='text-qrinavy text-sm flex items-center mb-0'>
                          <Icon icon='commit' size='sm' className='-ml-1.5' />
                          <div className='font-medium'>{commitishFromPath(dataset.path)}</div>
                        </div>
                        <div className='text-sm text-qrinavy mb-2 truncate' title={dataset.commit?.title}>{dataset.commit?.title}</div>
                        <div className='flex items-center text-gray-400 text-xs'>
                          <RelativeTimestampWithIcon timestamp={new Date(dataset.commit?.timestamp)} className='mr-3' />
                          <UsernameWithIcon username='chriswhong' className='mt-0.5' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <DownloadDatasetButton qriRef={qriRef} small light />
                      </div>
                    </div>
                    {/* Bottom of the box */}
                    <ContentBoxTitle title='Description' />
                    <div className='text-gray-400 text-xs tracking-wider mb-2 break-words'>{(dataset.meta?.description) || 'No Description'}</div>
                    {dataset.meta?.keywords && <MetaChips words={dataset.meta.keywords} />}
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
