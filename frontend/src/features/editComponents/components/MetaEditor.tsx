import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
// import cloneDeep from 'clone-deep'
// import ReactTooltip from 'react-tooltip'

import Spinner from '../../../chrome/Spinner'
import TextareaInput from '../../../chrome/forms/TextareaInput'
import TextInput from '../../../chrome/forms/TextInput'
import { Meta } from '../../../qri/dataset'
import Button from '../../../chrome/Button'
import TagInput from '../../../chrome/forms/TagInput'

// import hasParseError from '../../../utils/hasParseError'
// import { writeDataset } from '../../../actions/workbench'
// import { selectDatasetFromMutations, selectWorkingDatasetIsLoading, selectWorkingDatasetUsername, selectWorkingDatasetName, selectWorkingStatusInfo } from '../../../selections'
// import { QRI_IO_URL } from '../../../constants'
// import ExternalLink from '../../ExternalLink'
// import TextInput from '../../form/TextInput'
// import TextAreaInput from '../../form/TextAreaInput'
// import MultiTextInput from '../../form/MultiTextInput'
// import DropdownInput from '../../form/DropdownInput'
// import MetadataMultiInput from '../../form/MetadataMultiInput'
// import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'
// import ParseError from '../ParseError'
// import { connectComponentToProps } from '../../../utils/connectComponentToProps'

interface MetaEditorProps  {
  data?: Meta
  onDatasetChange: (field: string[], value: any) => void
  // statusInfo: StatusInfo
  loading?: boolean
}

const fields = [
  {
    field: 'title',
    inputType: 'text',
    maxLength: 600,
    title: 'Title',
    description: 'A single-line description of the dataset',
    placeholder: 'Add a title'
  },
  {
    field: 'description',
    inputType: 'textarea',
    maxLength: 600,
    title: 'Description',
    description: 'A 1-5 sentence summary of the dataset\'s contents',
    placeholder: 'Add a description'
  },
  {
    field: 'theme',
    inputType: 'tags',
    title: 'Theme',
    description: 'The main category or categories of the dataset',
    placeholder: '',
  },
  {
    field: 'keywords',
    inputType: 'tags',
    title: 'Keywords',
    description: 'Keywords or tags describing the dataset (more specific than theme)',
    placeholder: 'Add a new keyword',
  },
//  {/*
//    Dropdown Input uses react-select, which likes option that have 'label'
//    and 'value' keys/ To keep it generic, we map our options to meet the
//    requirements, and unmap them again on the way back out
//    */}
//  <DropdownInput
//    name='license'
//    label='License'
//    labelTooltip='A legal document under which the resource is made available'
//    value={
//      data.license
//        ? { label: data.license.type, value: data.license.url }
//        : null
//    }
//    placeHolder='Add a license'
//    options={licenseOptions.map((option) => ({
//      value: option.url,
//      label: option.type
//    }))}
//    onChange={(selectedOption) => {
//      let newValue = null
//      if (selectedOption) {
//        const { label: type, value: url } = selectedOption
//        newValue = {
//          type,
//          url
//        }
//      }
//      handleWrite(null, 'license', newValue)
//    }}
//  />
//  <MetadataMultiInput
//    name='contributors'
//    label='Contributors'
//    labelTooltip='Users who have contributed to the dataset'
//    value={data.contributors}
//    placeHolder='Add a contributor'
//    onWrite={handleWrite}
//  />
//  <MetadataMultiInput
//    name='citations'
//    label='Citations'
//    labelTooltip='Works cited for the dataset'
//    value={data.citations}
//    placeHolder='Add a citation'
//    onWrite={handleWrite}
//  />
  {
    field: 'accessURL',
    type: 'text',
    title: 'Access URL',
    description: 'A URL of the resource that gives access to a distribution of the dataset',
  },
  {
    field: 'downloadURL',
    type: 'text',
    title: 'Download URL',
    description: 'A direct link to download the dataset'
  },
  {
    field: 'homeURL',
    type: 'text',
    title: 'Home URL',
    description: 'A URL for the dataset homepage'
  },
//       <MultiTextInput
//         name='language'
//         label='Language'
//         labelTooltip='Languages of the dataset.<br/>This refers to the natural language<br/> used for textual metadata of a dataset or<br/>the textual values of a dataset distribution'
//         value={data.language}
//         placeHolder='Add a language'
//         onArrayChange={handleWrite}
//       />
//       <TextInput
//         name='accrualPeriodicity'
//         label='Accrual Periodicity'
//         labelTooltip='The frequency at which dataset is published'
//         type='text'
//         value={data.accrualPeriodicity}
//         placeHolder='Add Accrual Periodicity'
//         onBlur={handleWrite}
//         maxLength={600}
//       />
  {
    field: 'version',
    type: 'text',
    title: 'Version',
    description: 'A Version identifier for this dataset'
  },
  {
    field: 'identifier',
    type: 'text',
    title: 'Identifier',
    description: 'An identifier for this dataset'
  }
]

// const renderValue = (value: string) => {
//   switch (typeof value) {
//     case 'string':
//     case 'number':
//       return <span>{value}</span>
//     case 'object':
//       return <span>{JSON.stringify(value)}</span>
//     default:
//       return <span>{JSON.stringify(value)}</span>
//   }
// }

// const renderTable = (keys: string[], data: Meta) => {
//   return (
//     <div className='metadata-viewer-table-wrap'>
//       <table className='metadata-viewer-table'>
//         <tbody>
//           {keys.map((key) => {
//             const value = data[key]
//             let cellContent = renderValue(value)

//             return (
//               <tr key={key} className='metadata-viewer-row'>
//                 <td className='metadata-viewer-key'>{key}</td>
//                 <td>{cellContent}</td>
//               </tr>
//             )
//           })}
//         </tbody>
//       </table>
//     </div>
//   )
// }

const MetaEditor: React.FC<MetaEditorProps> = ({
  data,
  loading = false,
  statusInfo,
  onDatasetChange
}) => {
//   const username = qriRef.username || ''
//   const name = qriRef.name || ''
//   React.useEffect(ReactTooltip.rebuild, [])

//   if (hasParseError(statusInfo)) {
//     return <ParseError component='meta' />
//   }

//   const ignoreFields = ['qri', 'path']

//   const handleWrite = (e: React.FocusEvent, target: string = '', value: any = undefined) => {
//     const v = value || (e && e.target.value)
//     const t = target || (e && e.target.getAttribute('name')) || ''
//     const update: any = cloneDeep(data)

//     if (v === '' || v === undefined || v === null || Object.keys(v).length === 0) {
//       // if the value is empty and the original field is also undefined
//       // then the blur action was called, but no change was made
//       // so return early
//       if (!update[t]) return
//       delete update[t]
//     } else {
//       if (update[t] === v) return
//       update[t] = v
//     }

//     write(username, name, {
//       meta: update
//     })
//   }

//   const licenseOptions = [
//     {
//       url: 'http://opendatacommons.org/licenses/by/1.0/',
//       type: 'Open Data Commons Attribution License (ODC-By)'
//     },
//     {
//       url: 'http://opendatacommons.org/licenses/odbl/1.0/',
//       type: 'Open Data Commons Open Database License (ODbL)'
//     },
//     {
//       url: 'https://creativecommons.org/licenses/by/4.0/',
//       type: 'Creative Commons Attribution (CC BY)'
//     },
//     {
//       url: 'https://creativecommons.org/licenses/by-sa/4.0/',
//       type: 'Creative Commons Attribution-ShareAlike (CC BY-SA)'
//     },
//     {
//       url: 'http://www.gnu.org/licenses/fdl-1.3.en.html',
//       type: 'GNU Free Documentation License'
//     }
//   ]

//   const extra = Object.keys(data).filter((key) => {
//     return !(~standardFields.findIndex((sKey) => (key === sKey)) || ~ignoreFields.findIndex((iKey) => (key === iKey)))
//   })

  if (loading) {
    return <Spinner />
  }

  const handleWrite = (name: string, value: any) => {
    onDatasetChange(['meta', name], value)
  }

  if (!data) {
    return (
      <div className='p-4'>
        <div>
          <Button onClick={() => { onDatasetChange(['meta'], {}) }}>Add Meta Component</Button>
        </div>
      </div>
    )
  }

  return (
    <div className='p-4'>
      {fields.map((field) => {
        switch (field.inputType) {
          case 'text':
            return (<TextInput
              key={field.field}
              name={field.field}
              label={field.title}
              labelTooltip={field.description}
              type='text'
              value={data[field.field]}
              placeholder={field.placeholder}
              onChange={(e: React.FormEvent) => { handleWrite(field.field, e.target.value) }}
              maxLength={field.maxLength}
            />)
          case 'textarea':
            return (<TextareaInput
              key={field.field}
              name={field.field}
              label={field.title}
              value={data[field.field]}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              onChange={(e: React.FormEvent) => { handleWrite(field.field, e.target.value) }}
            />)
          case 'tags':
            return (<TagInput
              key={field.field}
              name={field.field}
              label={field.title}
              value={data[field.field]}
              placeHolder={field.placeholder}
              onArrayChange={(e: React.SyntheticEvent, name: string, value: any) => { handleWrite(field.field, value) }}
            />)
          default:
            return (<p>Unrecognized Input Type: {field.inputType}</p>)
        }
      })}
    </div>
  )

//   return (
//     <div className='content metadata-viewer-wrap'>
//       <h4 className='metadata-viewer-title'>
//         Standard Metadata
//         &nbsp;
//         <ExternalLink id='meta-docs' href={`${QRI_IO_URL}/docs/reference/dataset/#meta`}>
//           <span
//             data-tip={'Qri\'s common metadata fields.<br/>Click for more info.'}
//             className='text-input-tooltip'
//           >
//             <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
//           </span>
//         </ExternalLink>
//       </h4>
//       {(extra.length > 0) && <div>
//         <h4 className='metadata-viewer-title'>
//           Additional Metadata
//           &nbsp;
//           <span
//             data-tip={'Custom metadata fields. To edit, modify this dataset\'s meta.json file'}
//             className='text-input-tooltip'
//           >
//             <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
//           </span>
//         </h4>
//         {renderTable(extra, data)}
//       </div>}
//     </div>
//   )
}

export default MetaEditor
