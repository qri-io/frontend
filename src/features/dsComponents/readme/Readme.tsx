import React, { useCallback } from 'react'
import { useDispatch, useSelector } from "react-redux"
import MarkdownIt from 'markdown-it'
import SimpleMDE from 'react-simplemde-editor'

import { NewReadme, Readme } from '../../../qri/dataset'
import { selectDatasetEditorDataset } from "../../datasetEditor/state/datasetEditorState"
import { setDatasetEditorReadme } from "../../datasetEditor/state/datasetEditorActions"

export interface ReadmeProps {
  data?: Readme
  editor?: boolean
}

export const ReadmeComponent: React.FC<ReadmeProps> = ({
  data,
  editor
}) => {
  const md = new MarkdownIt()
  const { readme } = useSelector(selectDatasetEditorDataset)
  const dispatch = useDispatch()

  const handleReadmeChange = (v: string) => {
    const newReadme = NewReadme({ ...readme })
    newReadme.text = v
    dispatch(setDatasetEditorReadme(newReadme))
  }

  // overrides the default rendering of markdown-it to make sure links open in a new window
  const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    const aIndex = tokens[idx].attrIndex('target')

    if (aIndex < 0) {
      tokens[idx].attrPush(['target', '_blank']) // add new attribute
    } else {
      // @ts-expect-error
      tokens[idx].attrs[aIndex][1] = '_blank' // replace value of existing attr
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }

  const markdown = data?.text
  const refCallback = useCallback((el: HTMLDivElement) => {
    if (el && markdown) {
      el.innerHTML = md.render(markdown)
    }
  }, [markdown])
  if (editor) {
    return <SimpleMDE
      id="readme-editor"
      value={readme?.text || ''}
      onChange={handleReadmeChange}
      options={{
        spellChecker: false,
        sideBySideFullscreen: false,
        toolbar: [
          'preview',
          'bold',
          'italic',
          'strikethrough',
          'heading',
          '|',
          'code',
          'quote',
          '|',
          'link',
          'image',
          'table',
          '|',
          'unordered-list',
          'ordered-list'
        ],
        status: false,
        placeholder: 'Start writing your readme here'
      }}
    />
  }
  if (!markdown) {
    return (
      <div className='h-full w-full flex items-center'>
        <div className='text-center mx-auto text-sm text-qrigray-400'>
          no readme
        </div>
      </div>
    )
  }

  return (
    <div className='h-full w-full'>
      <div
        // use "editor-preview" class to piggie-back off the simplemde styling
        className="markdown-body whitespace-pre-wrap"
        ref={refCallback}
      >loading...
      </div>
    </div>
  )
}

export default ReadmeComponent
