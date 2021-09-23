import React from 'react';
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
}

const NavBar: React.FC<NavBarProps> = ({
  minimal = false,
  showSearch = true
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
    <div className='bg-white text-black text-bold flex items-center pr-8 font-medium' style={{
      paddingTop: 14,
      paddingBottom: 14,
    }}>
      <Link className='mr-5' to='/'>
        <div className={`flex align-center items-center justify-center ${expanded ? 'w-44' : 'w-24'}`}>
          <QriLogo />
          <div className={`font-bold text-xl ml-2 ${expanded ? 'block' : 'hidden'}`} style={{ fontSize: 21 }}>Qri</div>
        </div>
      </Link>
      {!minimal && showSearch && <SearchBox onSubmit={handleSearchSubmit} placeholder='Search for Datasets' />}
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
