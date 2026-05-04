import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdNkwGBhfFk3fQhaj1Hp1iPu4rZbKsiKw",
  authDomain: "helloaayee.firebaseapp.com",
  projectId: "helloaayee",
  storageBucket: "helloaayee.firebasestorage.app",
  messagingSenderId: "18119034179",
  appId: "1:18119034179:web:c90bdac0a2d78dcf921bf6",
};

// Prevent duplicate app
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// DO NOT use initializeAuth here
export const auth = getAuth(app);
export { firebaseConfig };

// export const auth = getAuth(app);