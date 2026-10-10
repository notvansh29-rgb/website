import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  db,
  doc,
  setDoc,
  getDoc,
} from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<User | null>;
  signInAsGuest: () => Promise<User | null>;
  logout: () => Promise<void>;
  syncProfileToFirestore: (user: User, additionalData?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        // Synchronize or update basic user metadata in Firestore if available
        try {
          await syncProfileToFirestore(user);
        } catch (err) {
          console.warn('Firestore user profile sync warning:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setAuthError(null);

  const syncProfileToFirestore = async (user: User, additionalData: any = {}) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || 'guest@studybuddy.ai',
          displayName: user.displayName || 'StudyBuddy Student',
          photoURL: user.photoURL || '',
          lastLoginAt: new Date().toISOString(),
          ...additionalData,
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore write warning:', err);
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: any) {
      console.error('Firebase Google Auth Error:', err);
      let msg = err.message || 'Google sign-in failed.';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in popup was closed before completion.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = 'Previous sign-in popup was cancelled.';
      } else if (err.code === 'auth/unauthorized-domain') {
        msg = 'This domain is not authorized in Firebase Console > Authentication > Settings > Authorized domains. Please add this preview URL.';
      }
      setAuthError(msg);
      return null;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      return result.user;
    } catch (err: any) {
      console.error('Firebase Email Login Error:', err);
      let msg = err.message || 'Invalid email or password.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect email or password.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please wait a moment and try again.';
      }
      setAuthError(msg);
      return null;
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    displayName: string
  ): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName && result.user) {
        await updateProfile(result.user, {
          displayName,
          photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
        });
      }
      return result.user;
    } catch (err: any) {
      console.error('Firebase Email Register Error:', err);
      let msg = err.message || 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setAuthError(msg);
      return null;
    }
  };

  const signInAsGuest = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (err: any) {
      console.error('Firebase Anonymous Auth Error:', err);
      setAuthError(err.message || 'Guest sign-in failed.');
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Firebase Signout Error:', err);
      setAuthError(err.message || 'Sign-out failed.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        clearError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        logout,
        syncProfileToFirestore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
