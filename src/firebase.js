import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import 'firebase/compat/storage';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAw3Z8r4OHrVRwrINcRCgwDTvX69Xn-KQ0",
  authDomain: "instagramclone-9ddf9.firebaseapp.com",
  projectId: "instagramclone-9ddf9",
  storageBucket: "instagramclone-9ddf9.appspot.com",
  messagingSenderId: "161393220197",
  appId: "1:161393220197:web:0d16a0e433890649dd048c",
  measurementId: "G-L9WX76BM95"
});

const db = firebaseApp.firestore()
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, storage };
