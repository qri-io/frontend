import React from 'react'

// import Store, { RouteProps } from '../../../models/store'
import { Meta, Citation, License, User, StandardFieldNames } from '../../../qri/dataset'
// import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

// import { connectComponentToProps } from '../../../utils/connectComponentToProps'

// import { selectDataset, selectDatasetIsLoading } from '../../../selections'
import ExternalLink from '../../../chrome/ExternalLink'
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
    {value && value.map((d, i) => (<span key={i} className='text-xs rounded bg-gray-300 px-2 py-1 mr-2'>{d}</span>))}
  </div>
)

const renderLicense = (license: License) => (
  <ExternalLink href={license.url}>
    {license.type}
  </ExternalLink>
)

const renderURL = (url: string) => (
  <ExternalLink href={url}>{url}</ExternalLink>
)

const renderArrayItemsTable = (value: any[]) => {
  return (
    <div>
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
    <div className='border rounded-md'>
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
              case 'accessUrl':
              case 'downloadUrl':
              case 'readmeUrl':
              case 'homeUrl':
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
              <tr key={key} className='border-b'>
                <td className='p-2 font-semibold text-xs text-right'>{key}</td>
                <td id={`meta-${key}`} className='p-2'>{cellContent}</td>
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
    <div className='p-3 h-full w-full overflow-auto pb-8'>
      <div className='text-sm font-semibold mb-2'>Standard Metadata</div>
      {renderTable(standard, data)}

      {(extra.length > 0) && <div>
        <h4 className='text-sm font-semibold mb-2'>Additional Metadata</h4>
        {renderTable(extra, data)}
      </div>}
    </div>
  )
}

export default MetaComponent
