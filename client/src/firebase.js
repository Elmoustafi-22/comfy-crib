// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "comfy-crib.firebaseapp.com",
  projectId: "comfy-crib",
  storageBucket: "comfy-crib.firebasestorage.app",
  messagingSenderId: "932662266521",
  appId: "1:932662266521:web:4efcef258d6121fede8608",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
