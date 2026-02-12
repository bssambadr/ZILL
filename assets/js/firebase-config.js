// assets/js/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
     apiKey: "AIzaSyC1nM_NlHweKSHwMgp5diTCf5jiV1e4v_M",
  authDomain: "zill-horror.firebaseapp.com",
  projectId: "zill-horror",
  storageBucket: "zill-horror.firebasestorage.app",
  messagingSenderId: "1000798913527",
  appId: "1:1000798913527:web:e18dc85104d930ba9c64f2",
  measurementId: "G-5VG8H2WZZE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
