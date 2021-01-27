import React from 'react';
import { Link } from 'react-router-dom';

import PageLayout from '../app/PageLayout';
import Icon from '../../chrome/Icon';

const Splash: React.FC<any> = () => (
  <PageLayout>
    <div className='max-w-screen-xl mx-auto px-10 py-20'>
      <div className="text-center pb-12 md:pb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
          Datasets that update themselves
        </h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-xl text-gray-600 mb-8">
            Qrimatic binds code to data, so you can keep your data fresh.  Just write a script to move and munge your data, set a schedule, and we'll take care of the rest.
          </p>
          <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
            <Link to="/ds/new" >
              <div className="px-8 py-4 rounded bg-black text-blue-50 max-w-max shadow-sm hover:shadow-lg font-semibold mr-2">
                Learn More
              </div>
            </Link>

            <Link to="/ds/new" >
              <div className="px-8 py-4 rounded bg-blue-600 text-blue-50 max-w-max shadow-sm hover:shadow-lg font-semibold">
                Try it out now <Icon className='ml-3' icon='arrowRight' />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
)

export default Splash;
