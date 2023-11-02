import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtGaU9zclzmofqyNUE0xHoY8wCplbtff8",
  authDomain: "ufc-fighter-experiment.firebaseapp.com",
  projectId: "ufc-fighter-experiment",
  storageBucket: "ufc-fighter-experiment.appspot.com",
  messagingSenderId: "873531048349",
  appId: "1:873531048349:web:24ff10b473e5290d52ef74",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
