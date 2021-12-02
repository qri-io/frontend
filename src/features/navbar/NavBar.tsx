import React from 'react'
import classNames from 'classnames'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import SessionUserMenu from './SessionUserMenu'
import SearchBox from '../search/SearchBox'
import QriLogo from '../../chrome/QriLogo'
import IconLink from '../../chrome/IconLink'
import ButtonGroup from '../../chrome/ButtonGroup'
import { selectNavExpanded } from '../app/state/appState'
import { AnonUser, selectSessionUser } from '../session/state/sessionState'
import { trackGoal } from '../../features/analytics/analytics'

export interface NavBarProps {
  minimal?: boolean
  showSearch?: boolean
  transparent?: boolean
  // noLogo hides the logo, used on homepage
  noLogo?: boolean
  // absolute places the header at the top of the container so it can appear on top of other divs, used on homepage
  absolute?: boolean
}

const NavBar: React.FC<NavBarProps> = ({
  minimal = false,
  showSearch = true,
  transparent = false,
  noLogo = false,
  absolute = false
}) => {
  const expanded = useSelector(selectNavExpanded)
  const user = useSelector(selectSessionUser)
  const location = useLocation()
  const history = useHistory()

  const buttonItems = [
    // TODO(chriswhong) - reinstate dashboard when this feature is available
    // { text: 'Dashboard', link: '/dashboard', icon: 'dashboard'},
    { text: 'My Datasets', link: '/collection', icon: 'myDatasets' }
  ]

  const handleSearchSubmit = (query: string) => {
    // general-search-from-navbar event
    trackGoal('PLKLNWYO', 0)
    const newParams = new URLSearchParams(`q=${query}`)
    history.push(`/search?${newParams.toString()}`)
  }

  return (
    <div className={classNames('text-black text-bold flex items-center pr-6 font-medium w-full z-40', {
      'bg-white': !transparent,
      'absolute top-0': absolute
    })} style={{
      paddingTop: 14,
      paddingBottom: 14
    }}>
      {!noLogo && (
        <Link className='mr-5' to='/'>
          <div className={`flex align-center items-center ml-6 md:ml-0 justify-start md:justify-center ${expanded ? 'w-44' : 'w-24'}`}>
            <QriLogo />
            <div className={`font-bold text-xl ml-2 ${expanded ? 'block' : 'hidden'}`} style={{ fontSize: 21 }}>Qri</div>
          </div>
        </Link>
      )}
      {!minimal && showSearch && (
      <div className='w-48 hidden md:block'>
        <SearchBox onSubmit={handleSearchSubmit} placeholder='Search for Datasets' />
      </div>
      )}

      <div className='m-auto items-center hidden md:flex'>
        {!minimal && (user !== AnonUser) && (
          <ButtonGroup
            items={buttonItems}
            selectedIndex={buttonItems.findIndex((d) => location.pathname === d.link)}
          />
        )}
      </div>
      <div className='flex-grow md:flex-grow-0'/>
      {!minimal && showSearch && (
      <div className='md:hidden'>
        <IconLink icon='skinnySearch' size='lg' link='/search' />
      </div>
      )}
      <div className='flex justify-end items-center'>
        <SessionUserMenu />
      </div>
    </div>
  )
}

export default NavBar
