import React from 'react'
import Helmet from 'react-helmet'

interface HeadProps {
  data?: {
    title?: string
    pathname?: string
    description?: string
    image?: string
    imageAlt?: string
    // appView will set the viewport meta tag to a fixed width
    appView?: boolean
  }
}

const Head: React.FunctionComponent<HeadProps> = ({ data = {}, children }) => {
  const {
    title,
    pathname,
    description,
    image,
    imageAlt,
    appView = false
  } = data

  return (
    <>
      <Helmet>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@qri_io" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Qri Cloud"/>

        { title && <title>{title}</title> }
        { title && <meta name="twitter:title" content={title} /> }
        { title && <meta property="og:title" content={title} /> }

        { description && <meta name="twitter:description" content={description}/> }
        { description && <meta property="og:description" content={description} /> }

        { image && <meta name="twitter:image" content={image} /> }
        { image && <meta property="og:image" content={image} /> }

        { imageAlt && <meta name="twitter:image-alt" content={imageAlt} />}

        { pathname && <meta property="og:url" content={`https://qri.cloud${pathname}`} />}

        { appView ? <meta name="viewport" content="width=1024" /> : <meta name="viewport" content="width=device-width, initial-scale=1" /> }

        {children}
      </Helmet>
    </>
  )
}

export default Head
