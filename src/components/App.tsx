import React from 'react';

import { Sidebar } from './Sidebar';
// import { CharSheet } from './CharSheet';
import { Notes } from './Notes';

// TODO: clean this up
require('./App.scss'); 

export const App = (): React.ReactElement => {
  return (
    <div className='App columns'>
      <div className='column is-narrow is-sidebar'>
        <button className='button is-burger is-primary is-small' />
        <Sidebar />
      </div>
      <div className='column'>
        {
          // <CharSheet />
        }
        {
          <Notes/>
        }
      </div>
    </div>
  )
};
