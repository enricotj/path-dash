import React from 'react';

import { Sidebar } from './Sidebar';
// import { CharSheet } from './CharSheet';
import { Notes } from './Notes';

import styles from './App.scss';

export const App = (): React.ReactElement => {
  return (
    <div className={ styles.app }>
      <div className={ styles.sidebar }>
        <button
          className={ styles.menuToggle }
        />
        <Sidebar />
      </div>
      <div className={ styles.content }>
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
