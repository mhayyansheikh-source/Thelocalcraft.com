import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhP5k37KXTYa8lukk5yR-lpX1LQtGdUb8",
  authDomain: "thelocalcrafts-20b92.firebaseapp.com",
  projectId: "thelocalcrafts-20b92",
  storageBucket: "thelocalcrafts-20b92.firebasestorage.app",
  messagingSenderId: "303990808238",
  appId: "1:303990808238:web:1c5a3215b8a1fc8dd0973f"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
