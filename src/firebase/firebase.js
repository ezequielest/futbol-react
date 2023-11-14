// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//PROD
const firebaseConfig = {
  apiKey: "AIzaSyAZZ6RI1JhvoqgXfm79aPFgvzBIWihpfLA",
  authDomain: "futbol-cb90e.firebaseapp.com",
  projectId: "futbol-cb90e",
  storageBucket: "futbol-cb90e.appspot.com",
  messagingSenderId: "846866798575",
  appId: "1:846866798575:web:18cadfec6ab0f030a6081a"
};

//DEV
/*const firebaseConfig = {
  apiKey: "AIzaSyAKbfNDHwu44qvv9H34HBxsrl2fd8E_rkU",
  authDomain: "futbol-dev-6abd8.firebaseapp.com",
  databaseURL: "https://futbol-dev-6abd8-default-rtdb.firebaseio.com",
  projectId: "futbol-dev-6abd8",
  storageBucket: "futbol-dev-6abd8.appspot.com",
  messagingSenderId: "638692041299",
  appId: "1:638692041299:web:621e128e92a107fe301ca6",
  measurementId: "G-VFBDB32R9W"
};*/


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db } ;