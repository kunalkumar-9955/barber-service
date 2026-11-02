import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const rawApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
// Firebase throws (auth/invalid-api-key) if apiKey is 'dummy' or invalid during SSR prerender
const validApiKey = (rawApiKey && rawApiKey !== 'dummy' && rawApiKey.startsWith('AIza'))
  ? rawApiKey
  : 'AIzaSyBvDummyKeyForNextJsPrerenderBuild000';

const firebaseConfig = {
  apiKey: validApiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456'
};

let app: any;
let auth: any;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
} catch (err) {
  try {
    app = getApps()[0] || null;
    auth = app ? getAuth(app) : null;
  } catch {
    app = null;
    auth = null;
  }
}

export { auth, app };
