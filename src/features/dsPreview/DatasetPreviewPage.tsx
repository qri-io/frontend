import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import useDimensions from 'react-use-dimensions'

import { newQriRef, QriRef } from '../../qri/ref'
import { selectDsPreview, selectIsDsPreviewLoading } from './state/dsPreviewState'
import { loadDsPreview } from './state/dsPreviewActions'
import Spinner from '../../chrome/Spinner'
import ContentBox from '../../chrome/ContentBox'
import ContentBoxTitle from '../../chrome/ContentBoxTitle'

import BodyPreview from '../dsComponents/body/BodyPreview'

import DatasetScrollLayout from '../dataset/DatasetScrollLayout'
import DeployingScreen from '../deploy/DeployingScreen'
import Readme from '../dsComponents/readme/Readme'

import MetaChips from '../../chrome/MetaChips'
import DatasetCommitInfo from '../../chrome/DatasetCommitInfo'
import DownloadDatasetButton from "../download/DownloadDatasetButton"
import ContentBoxSubTitle from "../../chrome/ContentBoxSubTitle"

interface DatasetPreviewPageProps {
  qriRef: QriRef
}

const DatasetPreviewPage: React.FC<DatasetPreviewPageProps> = ({
  qriRef
}) => {
  const dispatch = useDispatch()
  const dataset = useSelector(selectDsPreview)
  const loading = useSelector(selectIsDsPreviewLoading)

  const [versionInfoContainer, { height: versionInfoContainerHeight }] = useDimensions()
  const [expandReadme, setExpandReadme] = useState(false)

  let readmeContainerHeight = versionInfoContainerHeight || 'auto'

  if (expandReadme) {
    readmeContainerHeight = 'auto'
  }

  useEffect(() => {
    const ref = newQriRef({ username: qriRef.username, name: qriRef.name, path: qriRef.path })
    dispatch(loadDsPreview(ref))
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path ])

  return (
    <>
        {dataset?.username === ''
          ? (<div className='w-full h-full p-4 flex justify-center items-center'>
            <Spinner color='#43B3B2' />
          </div>)
          : (
            <DatasetScrollLayout contentClassName='max-w-screen-lg mx-auto'>
              <div className='flex -ml-2 -mr-3 mb-6'>
                {dataset.readme && (
                  <div className='flex-grow w-7/12 relative'>
                    <div className={classNames('px-2 align-top w-full', {
                      'absolute': !expandReadme
                    })} style={{ height: readmeContainerHeight }}>
                    <ContentBox className='flex flex-col h-full'>
                      <div className='flex flex-col h-full overflow-hidden'>
                        <ContentBoxTitle title='Readme'/>
                        <div className='flex-grow overflow-hidden'>
                          <Readme data={dataset.readme} />
                        </div>
                        {!expandReadme && (<div className='font-semibold text-qritile text-sm cursor-pointer mt-1' onClick={() => { setExpandReadme(true) }}>See More</div>)}
                      </div>
                    </ContentBox>
                  </div>
                </div>
                )}
                <div ref={versionInfoContainer} className={`${dataset.readme ? 'w-5/12' : 'w-full'} px-3 align-top`}>
                  <ContentBox>
                    <div className='flex items-center'>
                      <div className='flex-grow truncate'>
                        <div className='flex items-center justify-between'>
                          <div className='flex-grow min-w-0 pr-6'>
                            <ContentBoxTitle title='Latest Version' />
                            <DatasetCommitInfo dataset={dataset} small />
                          </div>
                          <div className='flex flex-shrink-0'>
                            <DownloadDatasetButton title='Download the latest version of this dataset as a zip file' hideIcon={true} type='primary' qriRef={qriRef} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </ContentBox>
                  <ContentBox className='mt-6'>
                    {/* Bottom of the box */}
                    <ContentBoxTitle title='Metadata' />
                    <ContentBoxSubTitle title='Description' />
                    <div className='text-qrigray-400 text-xs tracking-wider mb-2 break-words'>{(dataset.meta?.description) || 'No Description'}</div>
                    <ContentBoxSubTitle title='Keywords' />
                    {dataset.meta?.keywords && <MetaChips words={dataset.meta.keywords} />}
                  </ContentBox>
                </div>
              </div>
              <div className='overflow-hidden' style={{
                height: 'calc(100vh - 215px)'
              }}>
                <ContentBox className='h-full overflow-hidden flex flex-col'>
                  <div className='flex flex-col h-full overflow-hidden'>
                    <ContentBoxTitle title='Data' />
                    <BodyPreview dataset={dataset} loading={loading} />
                  </div>
                </ContentBox>
              </div>
            </DatasetScrollLayout>
            )}
        <DeployingScreen qriRef={qriRef} />
        </>
  )
}

export default DatasetPreviewPage
