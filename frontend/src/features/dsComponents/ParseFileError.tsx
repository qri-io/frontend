import React from 'react'


interface ParseFileErrorProps {
  component: string
  filename?: string
}

const ParseFileError: React.FC<ParseFileErrorProps> = ({
  component,
  filename,
}) => {
  return (
    <div className='unlinked-dataset margin'>
      <div className='message-container'>
        <div>
          <h4>There are parsing errors in your {component}</h4>
          <p>Fix the errors in <strong>{filename}</strong> to be able to view it.</p>
          {/* <ShowInFilesystem path={filename && path.dirname(filename)} /> */}
        </div>
      </div>
    </div>
  )
}

export default ParseFileError
