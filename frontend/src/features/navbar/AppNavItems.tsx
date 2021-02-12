import React from 'react'
import { Link } from 'react-router-dom'

const AppNavItems: React.FC<any> = () => (
  <>
    <Link className='px-4' to='/collection'>Collection</Link>
    <Link className='px-4' to='/activity'>Activity Feed</Link>
  </>
)


export default AppNavItems
