import React from 'react'

// import Store, { RouteProps } from '../../../models/store'
import { Meta, Citation, License, User, standardFieldNames } from '../../../qri/dataset'
// import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

// import { connectComponentToProps } from '../../../utils/connectComponentToProps'

// import { selectDataset, selectDatasetIsLoading } from '../../../selections'
import Link from '../../../chrome/Link'
import KeyValueTable from '../KeyValueTable'
import MetaChips from '../../../chrome/MetaChips'
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

const renderLicense = (license: License) => (
  <Link to={license.url}>
    {license.type}
  </Link>
)

const renderURL = (url: string) => (
  <Link to={url}>{url}</Link>
)

const renderArrayItemsTable = (value: any[]) => {
  return (
    <div>
      {value.map((item, i) => (
        <div key={i}>
          <KeyValueTable index={i} data={item} />
        </div>
      ))}
    </div>
  )
}

const renderMultiStructured = (value: User[] | Citation[]) => {
  return renderArrayItemsTable(value)
}

const renderTable = (keys: string[], data: Meta) => {
  return (
    <div>
      <table className='keyvalue-table'>
        <tbody>
          {keys.map((key) => {
            const value = data[key]
            let cellContent
            switch (key) {
              case 'theme':
              case 'keywords':
              case 'language':
                cellContent = <MetaChips words={value} />
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
              <tr key={key}>
                <td className='p-2 font-semibold text-sm text-left text-qrinavy capitalize'>{key}</td>
                <td id={`meta-${key}`} className='p-2 text-sm text-qrigray-400'>{cellContent}</td>
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
  const standard = standardFieldNames.filter((key) => !!data[key])
  const extra = Object.keys(data).filter((key) => {
    return !(~standardFieldNames.findIndex((sKey) => (key === sKey)) || ~ignoreFields.findIndex((iKey) => (key === iKey)))
  })

  return (
    <div className='h-full w-full overflow-auto'>
      <div className='text-xl font-normal text-qrinavy font-medium mb-2'>Standard Metadata</div>
      {renderTable(standard, data)}

      {(extra.length > 0) && <div>
        <h4 className='text-xl font-normal text-qrinavy font-medium mb-2'>Additional Metadata</h4>
        {renderTable(extra, data)}
      </div>}
    </div>
  )
}

export default MetaComponent
