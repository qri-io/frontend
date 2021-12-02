import React from 'react'
import IconLink from '../../chrome/IconLink'

const QriSocialLinks = () => (
  <div className='flex flex-grow justify-end'>
    {
      [
        { icon: 'github',
          link: 'https://github.com/qri-io'
        },
        { icon: 'youtube',
          link: 'https://www.youtube.com/channel/UC7E3_hURgFO2mVCLDwPSyOQ'
        },
        { icon: 'twitter',
          link: 'https://twitter.com/qri_io'
        },
        { icon: 'discord',
          link: 'https://discordapp.com/invite/thkJHKj'
        }
      ].map(({ icon, link }, i) => (
        <IconLink
          key={i}
          icon={icon}
          size='md'
          link={link}
          className='ml-5 first:ml-0'
          colorClassName='text-black hover:text-qripink-600'
        />
      ))
    }
  </div>
)

export default QriSocialLinks
