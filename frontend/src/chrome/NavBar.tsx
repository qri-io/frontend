import React from 'react';
import { Link } from 'react-router-dom'

const NavBar: React.FC<any> = () => {
  return (
    <div>
      <Link to='/'>Jobs</Link>
      <Link to='/datasets'>Datasets</Link>
    </div>
  )
}

export default NavBar
