// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use
// We only want to use Firebase Auth here
import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyAr6uxBgTkN5apVAbo6JrXmqwQ9b0dkZ3U',
  authDomain: 'path-dash-326eb.firebaseapp.com',
  databaseURL: 'https://path-dash-326eb.firebaseio.com',
  projectId: 'path-dash-326eb',
  storageBucket: 'path-dash-326eb.appspot.com',
  messagingSenderId: '370845427879',
  appId: '1:370845427879:web:6eab8f69e99d8c05249382'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Finally, export it to use it throughout your app
export default firebase;