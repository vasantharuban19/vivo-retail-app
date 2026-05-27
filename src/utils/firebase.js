// ============================================================
// firebase.js — Firebase initialization & Firestore helpers
// Replace the config values with your own from Firebase Console
// ============================================================

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ── Firebase project config ──────────────────────────────────
// These are loaded from .env.local (never hardcode in source)
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase app (safe to call multiple times)
const app = initializeApp(firebaseConfig);

/** Firestore database instance */
export const db = getFirestore(app);

/** Firestore collection reference */
const COLLECTION = "retail_activities";

// ── CRUD helpers ─────────────────────────────────────────────

/**
 * Fetch all submissions, ordered by timestamp descending.
 * @returns {Promise<Array>} Array of submission objects with Firestore id
 */
export async function fetchSubmissions() {
  const q = query(collection(db, COLLECTION), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Add a new submission to Firestore.
 * @param {Object} data  Form data (without id or timestamp)
 * @returns {Promise<string>} New document id
 */
export async function addSubmission(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    timestamp: serverTimestamp(),
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Update an existing submission by Firestore document id.
 * @param {string} id     Firestore document id
 * @param {Object} data   Updated fields
 */
export async function updateSubmission(id, data) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
}

/**
 * Delete a submission by Firestore document id.
 * @param {string} id  Firestore document id
 */
export async function deleteSubmission(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
