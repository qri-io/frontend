import React from 'react'
import { useDispatch, useSelector } from "react-redux"

import { Meta, Citation, License, User, standardFieldNames, NewMeta } from '../../../qri/dataset'
import Link from '../../../chrome/Link'
import KeyValueTable from '../KeyValueTable'
import MetaChips from '../../../chrome/MetaChips'
import TextInput from "../../../chrome/forms/TextInput"
import TextareaInput from "../../../chrome/forms/TextareaInput"
import KeysInput from "../../../chrome/forms/KeysInput"
import { selectDatasetEditorDataset } from "../../datasetEditor/state/datasetEditorState"
import { setDatasetEditorMeta } from "../../datasetEditor/state/datasetEditorActions"

interface MetaProps {
  data?: Meta
  editor?: boolean
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
                <td className='p-2 font-semibold text-sm text-left text-black capitalize'>{key}</td>
                <td id={`meta-${key}`} className='p-2 text-sm text-qrigray-400'>{cellContent}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export const MetaComponent: React.FunctionComponent<MetaProps> = ({
  data,
  editor
}) => {
  const dataset = useSelector(selectDatasetEditorDataset)
  const { meta: editableMeta } = dataset
  const dispatch = useDispatch()

  const onTitleChange = (title: string) => {
    onMetaChange('title', title)
  }

  const onDescriptionChange = (description: string) => {
    onMetaChange('description', description)
  }

  const onKeysChange = (keywords: string[]) => {
    onMetaChange('keywords', keywords)
  }

  const onMetaChange = (key: keyof Meta, value: string | string[]) => {
    const newMeta = NewMeta({ ...editableMeta })
    newMeta[key] = value
    dispatch(setDatasetEditorMeta(newMeta))
  }

  let standard: string[] = []
  let extra: string[] = []
  if (data) {
    // TODO (b5) - this should happen at the point of ingest from the API
    const ignoreFields = ['qri', 'path']
    standard = standardFieldNames.filter((key) => !!data[key])
    extra = Object.keys(data).filter((key) => {
      return !(~standardFieldNames.findIndex((sKey) => (key === sKey)) || ~ignoreFields.findIndex((iKey) => (key === iKey)))
    })
  }
  return (
    <div className='h-full w-full overflow-auto'>
      {editor
        ? <>
          <div className='mb-5'>
            <h2 className='font-bold text-sm mb-6'>Standard Metadata</h2>
            <h5 className='text-xs text-qrigray-400 font-bold mb-2'>Title</h5>
            <TextInput className='mb-3' placeholder='Give your project a title' onChange={onTitleChange} name='title' value={editableMeta?.title || ''}/>
            <h5 className='text-xs text-qrigray-400 font-bold mb-2'>Description</h5>
            <TextareaInput className='mb-3 w-full' placeholder='Write a description' name='title' onChange={onDescriptionChange} value={editableMeta?.description || ''}/>
            <h5 className='text-xs text-qrigray-400 font-bold mb-2'>Keywords</h5>
            <KeysInput placeholder={editableMeta?.keywords?.length ? '' : 'Type a keyword and press enter'} value={editableMeta?.keywords || []} onChange={onKeysChange} />
          </div>
        </>
        : <>
          <div className='text-xl font-normal text-black font-medium mb-2'>Standard Metadata</div>
          {data && renderTable(standard, data)}
          {data && (extra.length > 0) && <div>
            <h4 className='text-xl font-normal text-black font-medium mb-2'>Additional Metadata</h4>
            {renderTable(extra, data)}
          </div>}
        </>}
    </div>
  )
}

export default MetaComponent
