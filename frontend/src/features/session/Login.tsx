import React from 'react'
import { Link } from 'react-router-dom'


const Login: React.FC<any> = () => {
  return (
    <div>
      <h1>Login</h1>
      <Link to='/datasets'></Link>
    </div>
  )
}

export default Login;
