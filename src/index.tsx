import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './components/App';

// Import global styling
import './styles.global';

// SETTING UP REDUX STORE
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
// import thunk from 'redux-thunk';
// import reducers from './store/reducers';

// ENHANCING STORE WITH FIREBASE
import { firebaseReducer } from 'react-redux-firebase';
import firebase from './services/firebase';

import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

const rrfConfig = {
  userProfile: 'users'
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
  // enableClaims: true // Get custom claims along with the profile
};

const store = createStore(
  firebaseReducer,
  {}, // initial state
  compose() // to add other middleware
);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Router>
        <App />
      </Router>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);
