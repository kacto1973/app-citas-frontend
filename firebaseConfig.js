// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUhJI5n8qIFY99rAKHK7Tr3nfXV9ueWCI",
  authDomain: "citas-app-7d6e1.firebaseapp.com",
  databaseURL: "https://citas-app-7d6e1-default-rtdb.firebaseio.com",
  projectId: "citas-app-7d6e1",
  storageBucket: "citas-app-7d6e1.firebasestorage.app",
  messagingSenderId: "492208645519",
  appId: "1:492208645519:web:9d900000f16362e128d7fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export default database;
