// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyAYr2gH0vN6VxQJYHaQJYn413Jt0Lqv-ec",
  authDomain: "chat-app-07-b80c5.firebaseapp.com",
  projectId: "chat-app-07-b80c5",
  storageBucket: "chat-app-07-b80c5.firebasestorage.app",
  messagingSenderId: "40489394160",
  appId: "1:40489394160:web:047371f81155cefe554735",
  measurementId: "G-VGDTD5TFHK"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db= getFirestore(app)
export const provider = new GoogleAuthProvider();