import * as firebase from 'firebase';

const {
  FIREBASE_APIKEY,
  FIREBASE_DOMAIN,
  FIREBASE_URL,
  FIREBASE_STORAGE,
 } = process.env;

function createFirebaseStorage() {
  const config = {
    apiKey: FIREBASE_APIKEY,
    authDomain: FIREBASE_DOMAIN,
    databaseURL: FIREBASE_URL,
    storageBucket: FIREBASE_STORAGE,
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  return firebase.database();
}

export default createFirebaseStorage;
