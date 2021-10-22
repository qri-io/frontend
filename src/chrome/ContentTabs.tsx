import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

export interface Tab {
  name: string
  link?: string
  numberDecorator?: number
  selected?: boolean
  disabled?: boolean
}

interface ContentTabsProps {
  tabs: Tab[]
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ tabs }) => (
  <div className='flex'>
    {
      tabs.map((tab: Tab) => {
        const {
          name,
          link,
          selected = false,
          disabled = false,
          numberDecorator
        } = tab

        let tabContent = (
          <div className='flex justify-center'>
            {name}
            {
              !!numberDecorator &&
              (numberDecorator > 0) &&
              (
                <div className={classNames('text-white rounded px-2 ml-2', {
                  'bg-qripink': selected,
                  'bg-qrigray-400': !selected,
                })}>
                  {numberDecorator}
                </div>
              )
            }
          </div>
        )

        if (link) {
          tabContent = (
            <Link to={link}>
              {tabContent}
            </Link>
          )
        }

        return (
          <div
            key={tab.name}
            className={classNames('font-medium px-5 mr-2 last:mr-0 py-3 rounded-lg mb-4', {
              'selected': selected,
              'bg-white': selected,
              'text-qripink': selected,
              'bg-gray-200': !selected,
              'text-gray-400': disabled,
              'text-black': !disabled,
              'hover:cursor-pointer': !disabled,
            })}
          >
            {tabContent}
          </div>
        )
      })
    }
  </div>
)
