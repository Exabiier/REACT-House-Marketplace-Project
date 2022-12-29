
import { initializeApp } from "firebase/app";
// we have to import firebase in this config
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API}`,
  authDomain: `${process.env.REACT_APP_AUTHDOMAIN}`,
  projectId: `${process.env.REACT_APP_PROJECTID}`,
  storageBucket: `${process.env.REACT_APP_STORAGEBUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_MESSAGEID}`,
  appId: `${process.env.REACT_APP_APPID}`
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);