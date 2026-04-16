/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  deleteDoc, 
  getDocFromServer, 
  getDocs,
  initializeFirestore
} from 'firebase/firestore';
import firebaseAppletConfig from '../firebase-applet-config.json';

// Helper to get environment variables with fallback to config file
const getConfigValue = (viteKey: string, configKey: keyof typeof firebaseAppletConfig) => {
  const envValue = import.meta.env[viteKey];
  if (envValue && typeof envValue === 'string' && envValue.trim().length > 0) {
    return envValue.trim();
  }
  const configValue = firebaseAppletConfig[configKey];
  if (configValue && typeof configValue === 'string' && configValue.trim().length > 0) {
    return configValue.trim();
  }
  return '';
};

const firebaseConfig = {
  apiKey: getConfigValue('VITE_FIREBASE_API_KEY', 'apiKey'),
  authDomain: getConfigValue('VITE_FIREBASE_AUTH_DOMAIN', 'authDomain'),
  projectId: getConfigValue('VITE_FIREBASE_PROJECT_ID', 'projectId'),
  storageBucket: getConfigValue('VITE_FIREBASE_STORAGE_BUCKET', 'storageBucket'),
  messagingSenderId: getConfigValue('VITE_FIREBASE_MESSAGING_SENDER_ID', 'messagingSenderId'),
  appId: getConfigValue('VITE_FIREBASE_APP_ID', 'appId'),
  measurementId: getConfigValue('VITE_FIREBASE_MEASUREMENT_ID', 'measurementId'),
};

const firestoreDatabaseId = getConfigValue('VITE_FIREBASE_FIRESTORE_DATABASE_ID', 'firestoreDatabaseId');

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Initialize Firestore with experimentalForceLongPolling to handle proxy/socket issues
// and ensure the correct database ID is used.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firestoreDatabaseId || undefined);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error handling for Firestore operations
export enum FirestoreOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: FirestoreOperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: FirestoreOperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection to Firestore with retry
async function testConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("Firestore connection successful.");
      return;
    } catch (error) {
      if (i === retries - 1) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. Firestore is reporting offline.");
        } else {
          // Log other errors but don't necessarily show the "config" error if it's just a permission issue
          console.warn("Firestore connection test failed:", error);
        }
      } else {
        console.warn(`Firestore connection attempt ${i + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
}
testConnection();

export { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, query, where, deleteDoc, getDocs, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged };
export type { FirebaseUser };
