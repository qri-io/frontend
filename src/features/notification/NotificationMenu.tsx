import React from 'react'
import { Link } from 'react-router-dom'

const NotificationMenu: React.FC<any> = () => {
  return (
    <div>
      <div>
        <Link to='/notifications'>
          <h5>Notifications</h5>
        </Link>
      </div>
      <div>
        <Link to='/notification_settings'>
          <h5>Notification Settings</h5>
        </Link>
      </div>
    </div>
  )
}

export default NotificationMenu
