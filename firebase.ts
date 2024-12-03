// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1Wn1NiZP7DcStO_5mAxeOEn8ILgV0D7w",
  authDomain: "saas-app-52da9.firebaseapp.com",
  projectId: "saas-app-52da9",
  storageBucket: "saas-app-52da9.firebasestorage.app",
  messagingSenderId: "228387954631",
  appId: "1:228387954631:web:fd2fefedddb287e16c03e2"
};
// https://saas-app-52da9.firebaseapp.com/__/auth/handler
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);