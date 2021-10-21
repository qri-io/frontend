import React from 'react'
import classNames from 'classnames'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import SessionUserMenu from './SessionUserMenu'
import SearchBox from '../search/SearchBox'
import QriLogo from '../../chrome/QriLogo'
import ButtonGroup from '../../chrome/ButtonGroup'
import { selectNavExpanded } from '../app/state/appState'
import { AnonUser, selectSessionUser } from '../session/state/sessionState'


export interface NavBarProps {
  minimal?: boolean
  showSearch?: boolean
  transparent?: boolean
  // noLogo hides the logo, used on homepage
  noLogo?: boolean
}

const NavBar: React.FC<NavBarProps> = ({
  minimal = false,
  showSearch = true,
  transparent = false,
  noLogo = false
}) => {
  const expanded = useSelector(selectNavExpanded)
  const user = useSelector(selectSessionUser)
  const location = useLocation()
  const history = useHistory()


  const buttonItems = [
    // TODO(chriswhong) - reinstate dashboard when this feature is available
    // { text: 'Dashboard', link: '/dashboard', icon: 'dashboard'},
    { text: 'My Datasets', link: '/collection', icon: 'myDatasets'}
  ]

  const handleSearchSubmit = (query:string) => {
    const newParams = new URLSearchParams(`q=${query}`)
    history.push(`/search?${newParams.toString()}`)
  }

  return (
    <div className={classNames('text-black text-bold flex items-center pr-8 font-medium', {
      'bg-white': !transparent
    })} style={{
      paddingTop: 14,
      paddingBottom: 14,
    }}>
      {!noLogo && (
        <Link className='mr-5' to='/'>
          <div className={`flex align-center items-center justify-center ${expanded ? 'w-44' : 'w-24'}`}>
            <QriLogo />
            <div className={`font-bold text-xl ml-2 ${expanded ? 'block' : 'hidden'}`} style={{ fontSize: 21 }}>Qri</div>
          </div>
        </Link>
      )}
      <div className='w-48'>
        {!minimal && showSearch && <SearchBox onSubmit={handleSearchSubmit} placeholder='Search for Datasets' />}
      </div>
      <div className='flex m-auto items-center'>
        {!minimal && (user !== AnonUser) && (
          <ButtonGroup
            items={buttonItems}
            selectedIndex={buttonItems.findIndex((d) => location.pathname === d.link)}
          />
        )}
      </div>
      <SessionUserMenu />
    </div>
  )
}

export default NavBar
