// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,  } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn2fAARfYPPpK40FEnHunj81eHfCInaWA",
  authDomain: "joansapp-15256.firebaseapp.com",
  projectId: "joansapp-15256",
  storageBucket: "joansapp-15256.appspot.com",
  messagingSenderId: "1028131593641",
  appId: "1:1028131593641:web:6e4eab7c0aff1ffe04b8b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);

export const db = getFirestore(app);