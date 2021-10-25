import React from 'react'

import Link from '../../chrome/Link'
import Icon from '../../chrome/Icon'
import QriLogo from '../../chrome/QriLogo'

const SplashFooter = () => {
  return (
    <div className='bg-qrigray-1000 text-white py-14 px-5 md:px-10 lg:px-20 text-base w-full overflow-hidden'>
      <div className='flex flex-wrap -mx-10'>
        <div className='mb-10 px-10 w-full overflow-hidden lg:w-auto flex items-center self-start'>
          <QriLogo size='lg'/>
          <div className='text-4xl inline font-black ml-5'>Qri</div>
        </div>
        <div className='my-2 px-10 w-full overflow-hidden lg:w-auto flex-grow flex flex-wrap justify-start' >
          <div className='mr-16 mb-5'>
            <h5 className='text-qritile-600 font-bold mb-5'>Download</h5>
            <ul>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='/download'>Qri Desktop</Link></li>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='https://github.com/qri-io/qri/releases'>Qri CLI</Link></li>
            </ul>
          </div>
          <div className='mr-16 mb-5'>
            <h5 className='text-qritile-600 font-bold mb-5'>Learn</h5>
            <ul>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='/docs'>Tutorials</Link></li>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='/docs'>Docs</Link></li>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='/faq'>FAQs</Link></li>
            </ul>
          </div>
          <div className='mr-16'>
            <h5 className='text-qritile-600 font-bold mb-5'>Company</h5>
            <ul>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='/about'>About</Link></li>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='https://medium.com/qri-io'>Blog</Link></li>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='/jobs'>Jobs</Link></li>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='/contact'>Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className='text-qritile-600 font-bold mb-5'>Explore</h5>
            <ul>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='https://qri.cloud'>Dataset Search</Link></li>
              <li className='text-sm mb-3'><Link colorClassName='text-white' to='https://qri.cloud'>Qri.cloud</Link></li>
            </ul>
          </div>
        </div>
        <div className='my-2 px-10 w-full overflow-hidden lg:w-auto flex flex-col'>
          <h5 className='text-qritile-600 font-semibold mb-5'>Subscribe</h5>
          <div className='flex'>
            <div className='inline mr-4' onClick={ () => { fireEvent('social-link-click', 'github') }}>
              <Link colorClassName='text-qritile-600' to='https://github.com/qri-io'><Icon icon='github'/></Link>
            </div>
            <div className='inline mr-4' onClick={ () => { fireEvent('social-link-click', 'youtube') }}>
              <Link colorClassName='text-qritile-600' to='https://www.youtube.com/channel/UC7E3_hURgFO2mVCLDwPSyOQ'><Icon icon='youtube'/></Link>
            </div>
            <div className='inline mr-4' onClick={ () => { fireEvent('social-link-click', 'twitter') }}>
              <Link colorClassName='text-qritile-600' to='https://twitter.com/qri_io'><Icon icon='twitter'/></Link>
            </div>
            <div className='inline mr-4' onClick={ () => { fireEvent('social-link-click', 'discord') }}>
              <Link colorClassName='text-qritile-600' to='https://discordapp.com/invite/thkJHKj'><Icon icon='discord'/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplashFooter