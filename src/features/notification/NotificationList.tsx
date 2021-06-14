import React from 'react';
import { Link } from 'react-router-dom';

import NotificationMenu from './NotificationMenu';
import Page from '../app/Page'


const NotificationList: React.FC<any> = () => (
  <Page>
    <div className='max-w-screen-xl mx-auto px-10 py-20'>
      <header className='mb-8'>
        <h1 className='text-2xl font-extrabold'>Notifications</h1>
      </header>
      <div>
        <h1>Sidebar</h1>
        <NotificationMenu />
      </div>
      <div> Main
      <div>
        [-] Selected | Select All | Mark as read | Delete ||| [Filter Notifications: ______________________ ] ||| Group By: [Dataset / Date]
      </div>
        <div>
          <Link to='/job/id_1234_2'>
            <h5>[ ] |success| - job/dataset_name (id_1234_2, 01/01/2021 13:03:46)</h5>
          </Link>
        </div>
        <div>
          <Link to='/job/id_1234_1'>
            <h5>[x] |success| - job/dataset_name (id_1234_1, 01/01/2021 13:02:46)</h5>
          </Link>
        </div>
        <div>
          <Link to='/job/id_1234_0'>
            <h5>[ ] |success| - job/dataset_name (id_1234_0, 01/01/2021 13:01:46)</h5>
          </Link>
        </div>
      </div>
    </div>
  </Page>
)

export default NotificationList;
