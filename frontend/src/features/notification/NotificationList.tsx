import React from 'react'
import { Link } from 'react-router-dom'

const NotificationList: React.FC<any> = () => {
  return (
    <div>
      <h1>Notifications</h1>
      <div>
        <Link to='/'>
          <h5>Notification 1</h5>
        </Link>
      </div>
      <div>
        <Link to='/'>
          <h5>Notification 2</h5>
        </Link>
      </div>
      <div>
        <Link to='/'>
          <h5>Notification 3</h5>
        </Link>
      </div>
    </div>
  )
}

export default NotificationList;
