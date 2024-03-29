const composeHeadTags = (dataset, url) => {
  const { peername, name, meta } = dataset
  // start with generic title and description
  let title = `${peername}/${name} | qri.cloud`
  let description = `Preview this dataset on qri.cloud`

  // if meta, use meta values
  if (meta) {
    if (meta.title) {
      title = `${meta.title} | qri.cloud`
    }
    if (meta.description) {
      description = `${meta.description}`
    }
  }

  const data = { title, description }

  return `
    <title>${title}</title>
    <meta name="twitter:title" content="${title}"/>
    <meta property="og:title" content="${title}" />

    <meta name="twitter:description" content="${description}"/>
    <meta property="og:description" content="${description}" />

    <meta property="og:url" content="https://qri.cloud/${peername}/${name}" />
  `
}

exports.composeHeadTags = composeHeadTags

const composeJSONLD = (dataset) => {
  const {
    peername,
    name,
    meta = {}
  } = dataset

  const jld = {
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    name: meta.title || name,
    description: meta.description || `A dataset published on qri.cloud by ${peername}`,
    url: `https://qri.cloud/${peername}/${name}`,
    identifier: [`${peername}/${name}`],
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'qri.cloud'
    }
  }

  if (meta.keywords) jld.keywords = meta.keywords
  if (meta.license) jld.license = meta.license.url

  return `<script type="application/ld+json">${JSON.stringify(jld, null, 2)}</script>`
}

exports.composeJSONLD = composeJSONLD
