// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
  authDomain: "encode2025.firebaseapp.com",
  projectId: "encode2025",
  storageBucket: "encode2025.firebasestorage.app",
  messagingSenderId: "784120333239",
  appId: "1:784120333239:web:526d3200c3ef96b7da5e32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}