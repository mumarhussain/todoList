// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBA8OZaA1R6P1ILbyfAuMxi7FH_LhNIkTA",
  authDomain: "todolist-954a1.firebaseapp.com",
  projectId: "todolist-954a1",
  storageBucket: "todolist-954a1.appspot.com",
  messagingSenderId: "986151031513",
  appId: "1:986151031513:web:a80db4f47ea6e1055464c8",
  measurementId: "G-9G94FPWBTC"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);  
export const collection = db.collection
export const auth = getAuth(app);
export const storage = getStorage(app);