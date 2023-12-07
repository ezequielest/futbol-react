// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

/*const firebaseConfig = {
  apiKey: "AIzaSyAZZ6RI1JhvoqgXfm79aPFgvzBIWihpfLA",
  authDomain: "futbol-cb90e.firebaseapp.com",
  projectId: "futbol-cb90e",
  storageBucket: "futbol-cb90e.appspot.com",
  messagingSenderId: "846866798575",
  appId: "1:846866798575:web:18cadfec6ab0f030a6081a"
};*/

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db } ;