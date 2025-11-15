import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

// Initialize Firebase
export function initializeFirebase(): Firestore | null {
  if (db) {
    return db;
  }

  // Get Firebase config from environment variables or Constants
  // You can set these in app.json under expo.extra or use .env file
  const firebaseConfig: FirebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  };

  // Check if config is valid
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase config is missing. App will use static content. Please set Firebase environment variables for dynamic content.');
    // Return null instead of throwing - allows graceful fallback
    return null;
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    db = getFirestore(app);
    return db;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return null;
  }
}

// Get Firestore instance
export function getFirestoreInstance(): Firestore | null {
  if (!db) {
    try {
      db = initializeFirebase();
    } catch (error) {
      console.warn('Firebase initialization failed:', error);
      return null;
    }
  }
  return db;
}

// Get today's date key (YYYY-MM-DD format)
export function getTodayDateKey(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Content cache interface
export interface DailyContentCache {
  date: string;
  topics: CuratedTopic[];
  lastUpdated: Timestamp;
}

// Re-export CuratedTopic type for convenience
export interface CuratedTopic {
  title: string;
  subtitle: string;
  image: string;
  summary: string;
  category: string;
}

// Get daily curated topics from Firebase
export async function getDailyTopics(): Promise<CuratedTopic[]> {
  try {
    const firestore = getFirestoreInstance();
    if (!firestore) {
      return [];
    }
    const dateKey = getTodayDateKey();
    const docRef = doc(firestore, 'dailyContent', dateKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as DailyContentCache;
      return data.topics || [];
    }

    // If no content for today, return empty array
    // The backend service should populate this
    return [];
  } catch (error) {
    console.error('Error fetching daily topics from Firebase:', error);
    return [];
  }
}

// Save daily topics to Firebase (typically called by backend/admin service)
export async function saveDailyTopics(topics: CuratedTopic[]): Promise<void> {
  try {
    const firestore = getFirestoreInstance();
    if (!firestore) {
      throw new Error('Firebase is not configured. Cannot save topics.');
    }
    const dateKey = getTodayDateKey();
    const docRef = doc(firestore, 'dailyContent', dateKey);

    const cacheData: DailyContentCache = {
      date: dateKey,
      topics,
      lastUpdated: Timestamp.now(),
    };

    await setDoc(docRef, cacheData);
    console.log(`Saved ${topics.length} topics for ${dateKey}`);
  } catch (error) {
    console.error('Error saving daily topics to Firebase:', error);
    throw error;
  }
}

// Check if content exists for today
export async function hasContentForToday(): Promise<boolean> {
  try {
    const firestore = getFirestoreInstance();
    if (!firestore) {
      return false;
    }
    const dateKey = getTodayDateKey();
    const docRef = doc(firestore, 'dailyContent', dateKey);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking daily content:', error);
    return false;
  }
}

