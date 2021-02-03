import React from 'react'

// import Store, { RouteProps } from '../../../models/store'
import { Meta, Citation, License, User, StandardFieldNames } from '../../../qri/dataset'
// import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

// import { connectComponentToProps } from '../../../utils/connectComponentToProps'

// import { selectDataset, selectDatasetIsLoading } from '../../../selections'
// import ExternalLink from '../../ExternalLink'
import KeyValueTable from '../KeyValueTable'
// import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'

interface MetaProps {
  data?: Meta
  // loading: boolean
}

const renderValue = (value: string | string[] | object) => {
  switch (typeof value) {
    case 'string':
    case 'number':
      return <span>{value}</span>
    case 'object':
      return <span>{JSON.stringify(value)}</span>
    default:
      return <span>{JSON.stringify(value)}</span>
  }
}

const renderChips = (value: string[] | undefined) => (
  <div>
    {value && value.map((d, i) => (<span key={i} className='chip'>{d}</span>))}
  </div>
)

const renderLicense = (license: License) => (
  <a id='render-license' href={license.url} target='_blank' rel="noreferrer">
    {license.type}
  </a>
)

const renderURL = (url: string) => (
  <a id='render-url' href={url} target='_blank' rel="noreferrer">{url}</a>
)

const renderArrayItemsTable = (value: any[]) => {
  return (
    <div className='array-items-table-container'>
      {
        value.map((item, i) => (<div key={i}><KeyValueTable index={i} data={item} /></div>))
      }
    </div>
  )
}

const renderMultiStructured = (value: User[] | Citation[]) => {
  return renderArrayItemsTable(value)
}

const renderTable = (keys: string[], data: Meta) => {
  return (
    <div className='keyvalue-table-wrap'>
      <table className='keyvalue-table'>
        <tbody>
          {keys.map((key) => {
            const value = data[key]
            let cellContent
            switch (key) {
              case 'theme':
              case 'keywords':
              case 'language':
                cellContent = renderChips(value)
                break
              case 'license':
                cellContent = renderLicense(value)
                break
              case 'accessURL':
              case 'downloadURL':
              case 'readmeURL':
              case 'homeURL':
                cellContent = renderURL(value)
                break
              case 'contributors':
              case 'citations':
                cellContent = renderMultiStructured(value)
                break
              default:
                cellContent = renderValue(value)
            }

            return (
              <tr key={key} className='keyvalue-table-row'>
                <td className='keyvalue-table-key'>{key}</td>
                <td id={`meta-${key}`}>{cellContent}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export const MetaComponent: React.FunctionComponent<MetaProps> = ({ data }) => {

  if (!data) return null


  // TODO (b5) - this should happen at the point of ingest from the API
  const ignoreFields = ['qri', 'path']
  const standard = StandardFieldNames.filter((key) => !!data[key])
  const extra = Object.keys(data).filter((key) => {
    return !(~StandardFieldNames.findIndex((sKey) => (key === sKey)) || ~ignoreFields.findIndex((iKey) => (key === iKey)))
  })

  return (
    <div className='content metadata-viewer-wrap'>
      <h4 className='metadata-viewer-title'>Standard Metadata</h4>
      {renderTable(standard, data)}

      {(extra.length > 0) && <div>
        <h4 className='metadata-viewer-title'>Additional Metadata</h4>
        {renderTable(extra, data)}
      </div>}
    </div>
  )
}

export default MetaComponent
