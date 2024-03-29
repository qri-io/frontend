import React from 'react'
import ReactJson from 'react-json-view'
import { Body } from '../../../qri/dataset'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
// import SpinnerWithIcon from './chrome/SpinnerWithIcon'

interface BodyJsonProps {
  data?: Body
  // loading: boolean
  previewWarning?: boolean
}

const BodyJson: React.FunctionComponent<BodyJsonProps> = (props) => {
  const { data } = props
  if (!data) return null
  /**
   * only show the loading spinner if there is no data loaded already
   * if we have paginated data, it is possible to be loading and also have data
   * to display
   */
  // if (loading && !!data) return <SpinnerWithIcon loading />

  return (
    <div
      id='body-json-container'
      className='h-full w-full overflow-auto pb-8'
    >
      {/* {previewWarning && <div className='preview-warning'><FontAwesomeIcon icon={faExclamationTriangle} size='xs' /> This is a preview of the first 50 items in this json array</div>} */}
      <div id='body-json-array'>
        <ReactJson
          name={null}
          src={data}
          displayDataTypes={false}
          enableClipboard={false}
          collapsed={2}
        />
      </div>
    </div>
  )
}

export default BodyJson
