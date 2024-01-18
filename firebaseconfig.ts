// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnVPSS9LRVoXJmbr6YFFMFZvF4YzQdLoA",
  authDomain: "lio-chat-app.firebaseapp.com",
  projectId: "lio-chat-app",
  storageBucket: "lio-chat-app.appspot.com",
  messagingSenderId: "916868828574",
  appId: "1:916868828574:web:5ba65e0204773b321ada8f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();