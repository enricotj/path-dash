import React from 'react';

import { Sidebar } from './Sidebar';
// import { CharSheet } from './CharSheet';
import { Notes } from './Notes';

import styles from './App.scss';

import { Switch, Route } from "react-router-dom";

const Main = (): React.ReactElement => {
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
  );
}

const Login = (): React.ReactElement => {
  return (
    <div>
      TODO: Login Page
    </div>
  );
}

export const App = (): React.ReactElement => {
  return (
    <Switch>
      <Route exact path='/' component={Main} />
      <Route exact path='/login' component={Login} />
    </Switch>
  );
};
