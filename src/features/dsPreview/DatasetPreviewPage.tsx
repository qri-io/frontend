import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useDimensions from 'react-use-dimensions'

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

import DatasetScrollLayout from '../dataset/DatasetScrollLayout'
import DeployingScreen from '../deploy/DeployingScreen'
import commitishFromPath from '../../utils/commitishFromPath'
import Readme from '../dsComponents/readme/Readme'
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
    <>
        {dataset?.peername === ''
        ? (<div className='w-full h-full p-4 flex justify-center items-center'>
            <Spinner color='#4FC7F3' />
          </div>)
        : (
            <DatasetScrollLayout contentClassName='max-w-screen-lg mx-auto'>
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
                        <ContentBoxTitle title='Latest Version' />
                        <div className='text-qrinavy font-semibold text-sm flex items-center mb-2'>
                          <div className=''>{dataset.commit?.title}</div>
                        </div>
                        <div className='flex items-center text-xs text-gray-400'>
                          <UsernameWithIcon username={dataset.peername} className='mr-3' />
                          <RelativeTimestampWithIcon className='mr-3' timestamp={new Date(dataset.commit?.timestamp)} />
                          <Icon icon='commit' size='sm' className='-ml-2' />
                          <div className=''>{commitishFromPath(dataset.path)}</div>
                        </div>
                      </div>
                    </div>
                    {/* Bottom of the box */}
                    <ContentBoxTitle title='Description' />
                    <div className='text-gray-400 text-xs tracking-wider mb-2 break-words'>{(dataset.meta?.description) || 'No Description'}</div>
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
                    <BodyPreview dataset={dataset} />
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
