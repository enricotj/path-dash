import React from 'react';

import { Sidebar } from './Sidebar';

// TODO: clean this up
require('./App.scss'); 

export const App = (): React.ReactElement => {
  return (
    <div className='App columns'>
      <div className='column is-narrow is-sidebar is-2'>
        <button className='button is-burger is-primary is-small' />
        <Sidebar />
      </div>
      <div className='column'>
      <a className='button is-primary'> Hello World! </a>
      </div>
    </div>
  )
};
