// ============================================================
// useSubmissions.js — Submissions state + CRUD operations
// Uses localStorage as offline-capable fallback to Firebase
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { DUMMY_SUBMISSIONS } from "../data/dummyData";

const STORAGE_KEY = "vivo_tn_submissions";
const USE_FIREBASE = process.env.REACT_APP_USE_FIREBASE === "true";

/** Load persisted submissions or seed with dummy data */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DUMMY_SUBMISSIONS; // Seed with demo data on first run
}

/** Persist to localStorage */
function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // ── Initial load ─────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        if (USE_FIREBASE) {
          // Dynamic import avoids crashing when Firebase creds are not set
          const { fetchSubmissions } = await import("../utils/firebase");
          const data = await fetchSubmissions();
          setSubmissions(data);
        } else {
          setSubmissions(loadFromStorage());
        }
      } catch (err) {
        console.warn("Firebase unavailable, using localStorage:", err.message);
        setSubmissions(loadFromStorage());
        setError("Offline mode — data stored locally");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Sync localStorage whenever submissions change ─────────
  useEffect(() => {
    if (!loading) saveToStorage(submissions);
  }, [submissions, loading]);

  // ── Add ──────────────────────────────────────────────────
  const addSubmission = useCallback(async (formData) => {
    const newSub = {
      ...formData,
      id:        "sub_" + Date.now(),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (USE_FIREBASE) {
      try {
        const { addSubmission: fbAdd } = await import("../utils/firebase");
        const fbId = await fbAdd(formData);
        newSub.id = fbId;
      } catch (err) {
        console.warn("Firebase write failed, saving locally:", err.message);
      }
    }

    setSubmissions((prev) => [newSub, ...prev]);
    return newSub;
  }, []);

  // ── Update ───────────────────────────────────────────────
  const updateSubmission = useCallback(async (id, formData) => {
    const updated = { ...formData, id, updatedAt: new Date().toISOString() };

    if (USE_FIREBASE) {
      try {
        const { updateSubmission: fbUpdate } = await import("../utils/firebase");
        await fbUpdate(id, formData);
      } catch (err) {
        console.warn("Firebase update failed, saving locally:", err.message);
      }
    }

    setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  }, []);

  // ── Delete ───────────────────────────────────────────────
  const removeSubmission = useCallback(async (id) => {
    if (USE_FIREBASE) {
      try {
        const { deleteSubmission: fbDelete } = await import("../utils/firebase");
        await fbDelete(id);
      } catch (err) {
        console.warn("Firebase delete failed, removing locally:", err.message);
      }
    }
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { submissions, loading, error, addSubmission, updateSubmission, removeSubmission };
}
