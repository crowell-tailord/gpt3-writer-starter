// Import the functions you need from the SDKs you need
import { getDatabase } from "@firebase/database";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAt-xkq9USkywZVyf3nwYlaoscn19iIP6I",
  authDomain: "smol-file-saves.firebaseapp.com",
  projectId: "smol-file-saves",
  storageBucket: "smol-file-saves.appspot.com",
  messagingSenderId: "633992955964",
  appId: "1:633992955964:web:970fa17786c48d984b9b39",
  databaseURL: "https://smol-file-saves-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);