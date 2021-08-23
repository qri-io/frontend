import React from 'react'

import Link from '../../chrome/Link'
import IconLink from '../../chrome/IconLink'

const Footer: React.FC<{}> = () => (
  <div className='flex w-9/12 mx-auto text-qrinavy text-sm py-5 tracking-wide'>
    <div className='flex flex-grow font-medium'>
      <Link
        className='mr-10'
        colorClassName='text-qrinavy hover:text-qripink'
        to='https://qri.io/docs'
      >
        Tutorials
      </Link>
      <Link
        className='mr-10'
        colorClassName='text-qrinavy hover:text-qripink'
        to='https://qri.io/docs'
      >
        Docs
      </Link>
      <Link
        className='mr-10'
        colorClassName='text-qrinavy hover:text-qripink'
        to='https://qri.io/faq'
      >
        FAQs
      </Link>
    </div>
    <div className='flex flex-grow justify-end'>
      {
        [
          { icon: 'github',
            link: 'https://github.com/qri-io',
          },
          { icon: 'youtube',
            link: 'https://www.youtube.com/channel/UC7E3_hURgFO2mVCLDwPSyOQ',
          },
          { icon: 'twitter',
            link: 'https://twitter.com/qri_io',
          },
          { icon: 'discord',
            link: 'https://discordapp.com/invite/thkJHKj',
          }
        ].map(({ icon, link }, i) => (
          <IconLink
            key={i}
            icon={icon}
            size='md'
            link={link}
            className='ml-5'
          />
        ))
      }
    </div>
  </div>
)


export default Footer
