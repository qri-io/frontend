import React, { useCallback } from 'react'
import MarkdownIt from 'markdown-it'

import { Readme } from '../../../qri/dataset'

export interface ReadmeProps {
  data?: Readme
}

export const ReadmeComponent: React.FC<ReadmeProps> = ({ data }) => {
  const md = new MarkdownIt({
    html: true,
    typographer: true
  })

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
        className="markdown-body"
        ref={refCallback}
      >loading...
      </div>
    </div>
  )
}

export default ReadmeComponent
