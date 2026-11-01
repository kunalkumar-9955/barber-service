'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, referralCode?: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const backendLogin = async (idToken: string, referralCode?: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, referralCode })
    });
    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      localStorage.setItem('barberpro_token', data.token);
      setUser(data.user);
    }
  };

  const login = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await credential.user.getIdToken();
    await backendLogin(idToken);
  };

  const register = async (email: string, password: string, name: string, referralCode?: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(credential.user);
    await backendLogin(await credential.user.getIdToken(), referralCode);
    await updateProfile(credential.user, { displayName: name });
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    await backendLogin(await credential.user.getIdToken());
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('barberpro_token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        await backendLogin(idToken);
      } else {
        setToken(localStorage.getItem('barberpro_token'));
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (token) setLoading(false);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
