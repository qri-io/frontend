import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export interface DropZoneProps {
  onFileUpload: (file: File[]) => void
  subtitle?: string
  file?: File
}

function humanFileSize (bytes: number, dp = 1) {
  const thresh = 1024

  if (Math.abs(bytes) < thresh) {
    return bytes.toString() + ' B'
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

  return bytes.toFixed(dp) + ' ' + units[u]
}

function getFileType (fileName: string) {
  return fileName.split('.').pop()
}

const DropZone: React.FunctionComponent<DropZoneProps> = (props) => {
  const { subtitle, onFileUpload, file } = props
  const [ uploadError, setUploadError ] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if ((acceptedFiles && acceptedFiles[0]) &&
      (getFileType(acceptedFiles[0].name) === 'json' || getFileType(acceptedFiles[0].name) === 'csv')) {
      setUploadError('')
      onFileUpload(acceptedFiles)
    } else {
      setUploadError('Wrong file type, only .csv, .json are accepted')
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (<div {...getRootProps()} className='drag-drop h-full w-full flex items-center justify-center' id='drag-drop'>
    <div className='text-md text-qrigray-400 flex flex-col items-center'>
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 2.5H6.5C5.96957 2.5 5.46086 2.71071 5.08579 3.08579C4.71071 3.46086 4.5 3.96957 4.5 4.5V20.5C4.5 21.0304 4.71071 21.5391 5.08579 21.9142C5.46086 22.2893 5.96957 22.5 6.5 22.5H18.5C19.0304 22.5 19.5391 22.2893 19.9142 21.9142C20.2893 21.5391 20.5 21.0304 20.5 20.5V9.5L13.5 2.5Z" stroke="#D5DADD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.5 2.5V9.5H20.5" stroke="#D5DADD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className='text-center mt-3.5'>
        {file
          ? <>
            <p>Selected <span className='font-mono'>{file?.name}</span> ({humanFileSize(file?.size)})</p>
            <label htmlFor="upload">
              <input {...getInputProps()} className='hidden' id="upload" type="file" name="file"/>
            </label>
            {uploadError && <p className='text-red-500 text-xs'>{uploadError}</p>}
          </>
          : <>
            {subtitle && <p>{subtitle}</p>}
            <label htmlFor="upload">
              <span className='cursor-pointer text-qritile-600'>Select </span>
              <input accept=".csv" {...getInputProps()} className='hidden' id="upload" type="file" name="file"/>
            </label>
            or Drop your file here
            {uploadError && <p className='text-red-500 text-xs'>{uploadError}</p>}
          </>}
      </div>
    </div>
  </div>)
}

export default DropZone
