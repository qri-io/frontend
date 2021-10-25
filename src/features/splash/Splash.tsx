import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import Button from '../../chrome/Button'
import Link from '../../chrome/Link'
import QriLogo from '../../chrome/QriLogo'
import SearchResultItem from '../search/SearchResultItem'
import SearchBox from '../search/SearchBox'
import NavBar from '../navbar/NavBar'
import SplashFooter from '../footer/SplashFooter'
import featuredDatasets from './featuredDatasets'
import BigCircle from './BigCircle'
import { trackGoal } from '../../features/analytics/analytics'

const Splash: React.FC<{}> = () => {
  const history = useHistory()

  const [selectedFeaturedDatasetType, setSelectedFeaturedDatasetType] = useState('popular')

  const handleSearchSubmit = (query:string) => {
    const newParams = new URLSearchParams(`q=${query}`)
    history.push(`/search?${newParams.toString()}`)
  }

  return (
    <div className='flex flex-col' style = {{
      backgroundImage: 'url(/img/splash/dot.svg)'
    }}>
      <div className='h-screen' style={{
        minHeight: 700
      }}>
        <div className='flex h-full'>
          <div className='flex-grow relative overflow-hidden relative pl-20 pr-28 py-20'>
            <BigCircle />
            <div className='relative z-10 flex items-center h-full'>
              <div className='absolute top-0'>
                <div className='flex items-center'>
                  <QriLogo size='xl'/>
                  <div className='font-extrabold inline-block ml-6' style={{ fontSize: 52 }}>Qri</div>
                </div>
              </div>
              <div className='mt-20'>
                <div className='font-extrabold mb-2 text-3xl xl:text-6xl'>
                  <div className='text-qritile-600'>Datasets that</div>
                  <div className='text-qripink-600'>Update Themselves</div>
                </div>
                <div className='text-lg xl:text-2xl mb-7'>Search thousands of datasets published by our community.</div>
                <div className='mb-7'>
                  <SearchBox onSubmit={handleSearchSubmit} placeholder='Search for Datasets' shadow border={false} size='lg' />
                </div>
                <div className='text-lg xl:text-2xl'>
                  Want to get started quickly? Check out <Link to='https://qri.io/docs' colorClassName='text-qripink-600 hover:text-qripink-700 font-bold'>our tutorials</Link>.
                </div>
              </div>
            </div>
          </div>
          <div className = 'flex flex-col flex-shrink-0' style={{ width: 510, }}>
            <NavBar minimal transparent noLogo />
            <div className='font-bold text-3xl mb-6 px-9'>Discover Datasets</div>
            <div className='mb-4 flex items-center px-9'>
              {
                Object.keys(featuredDatasets).map((key) => {
                  const { id, title } = featuredDatasets[key]
                  return (
                    <Button
                      key={title}
                      className='mr-3'
                      size = 'sm'
                      type={id === selectedFeaturedDatasetType ? 'secondary-outline' : 'light'}
                      onClick={() => {
                        // home-click-featured-dataset-list-button event
                        trackGoal('SRIJWHUA', 0);
                        setSelectedFeaturedDatasetType(id)
                      }}
                    >
                      {title}
                    </Button>
                  )
                })
              }
            </div>
            <div className='overflow-y-scroll hide-scrollbar pt-2 px-9 pb-8'>
              {
                featuredDatasets[selectedFeaturedDatasetType].datasets.map((dataset, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        // home-click-featured-dataset event
                        trackGoal('0D5HYPFA', 0)
                      }}
                    >
                      <SearchResultItem dataset={dataset} card />
                    </div>
                  )
                })
              }
              <Link to='/search'>
                <Button type='secondary' size='lg' block>Explore More</Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
      <SplashFooter />
    </div>
  )

}

export default Splash
