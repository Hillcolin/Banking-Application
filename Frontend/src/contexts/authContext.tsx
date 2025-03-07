import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: any;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createUserInFirestore(user);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createUserInFirestore = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    try {
      const userDocSnap = await getDoc(userRef);
      if (!userDocSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          balance: 100, // Set default balance to 100
        });
        console.log("User added to Firestore.");
      }
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
      alert("Error creating user profile. Please contact support.");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await createUserInFirestore(user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      if ((error as any).code === 'auth/popup-closed-by-user') {
        alert('The popup was closed before completing the sign in.');
      } else {
        alert('An error occurred during Google sign in. Please try again.');
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await createUserInFirestore(user);
    } catch (error) {
      console.error('Error signing in with email:', error);
      if ((error as any).code === 'auth/invalid-credential') {
        alert('Invalid credentials. Please check your email and password.');
      } else {
        alert('An error occurred during email sign in. Please try again.');
      }
    }
  };

  const createAccount = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await createUserInFirestore(user);
    } catch (error) {
      console.error('Error creating account:', error);
      alert('An error occurred during account creation. Please try again.');
    }
  };

  const value = {
    currentUser,
    signInWithGoogle,
    signInWithEmail,
    createAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;