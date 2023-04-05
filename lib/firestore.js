import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmhiVrlHuPBJkwwnwwLJa03zBfEfgRrtg",
  authDomain: "qb-stats.firebaseapp.com",
  projectId: "qb-stats",
  storageBucket: "qb-stats.appspot.com",
  messagingSenderId: "826864509470",
  appId: "1:826864509470:web:a847e4bbe5f939b83d840f",
  measurementId: "G-9EE6P554P9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db};