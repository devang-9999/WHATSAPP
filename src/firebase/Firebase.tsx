// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYr2gH0vN6VxQJYHaQJYn413Jt0Lqv-ec",
  authDomain: "chat-app-07-b80c5.firebaseapp.com",
  projectId: "chat-app-07-b80c5",
  storageBucket: "chat-app-07-b80c5.firebasestorage.app",
  messagingSenderId: "40489394160",
  appId: "1:40489394160:web:047371f81155cefe554735",
  measurementId: "G-VGDTD5TFHK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app)

export const db= getFirestore(app)
export const provider = new GoogleAuthProvider;