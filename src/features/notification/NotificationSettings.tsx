import React from 'react'
import NotificationMenu from './NotificationMenu'

const NotificationSettings: React.FC<any> = () => {
  return (
    <div>
      <h1>Notification Settings</h1>
      <div>
        <h1>Sidebar</h1>
        <NotificationMenu />
      </div>
      <div> Main
        <div>
          Email Notifications
          <div>Global:  on [o| ] off</div>
          <div>Aggregation: [None, Daily, Weekly, Monthly]</div>
          <div>Aggregation Level: [error, warn, info]</div>
        </div>
        <div>
          Notification Subscriptions
          <div> me/dataset_1    [none, error, warn, info]</div>
          <div> me/dataset_2    [none, error, warn, info]</div>
          <div> me/dataset_3    [none, error, warn, info]</div>
          <div> me/dataset_4    [none, error, warn, info]</div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings
