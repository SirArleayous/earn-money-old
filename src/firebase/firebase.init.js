import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6h9LLdboTnX6FEuCh_sEa4fBpZQmaM-Y",
  authDomain: "earn-money-34177.firebaseapp.com",
  projectId: "earn-money-34177",
  storageBucket: "earn-money-34177.firebasestorage.app",
  messagingSenderId: "101077322900",
  appId: "1:101077322900:web:6be7fc3f123a015d55b881",
  measurementId: "G-71N51R462B"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;