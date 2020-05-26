import React from 'react';

import { Sidebar } from './Sidebar';
// import { CharSheet } from './CharSheet';
import { Notes } from './Notes';

// TODO: clean this up
require('./App.scss'); 

export const App = (): React.ReactElement => {
  return (
    <div className='App columns'>
      <div className='is-sidebar'>
        <button className='button is-burger is-primary is-small is-paddingless' style={ { margin:'8px', width: '20px', height: '20px' } } />
        <Sidebar />
      </div>
      <div className='column' style={ { overflowY: 'scroll', height: '100%' } }>
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
