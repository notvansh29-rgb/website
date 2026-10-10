import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBzcBy7V7tYY5K5Mf4EmFfml5mg7FjgIaU",
  authDomain: "studybuddy-da3b4.firebaseapp.com",
  projectId: "studybuddy-da3b4",
  storageBucket: "studybuddy-da3b4.firebasestorage.app",
  messagingSenderId: "30615389592",
  appId: "1:30615389592:web:3894585db9e108b2c957ed",
  measurementId: "G-3S2JZSQD1B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (conditionally safe for all browser/preview contexts)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics fallback if disabled in iframe
  });
}

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Cloud Firestore
export const db = getFirestore(app);

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
};

export type { User };
