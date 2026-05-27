// ============================================================
// useSubmissions.js — Submissions state + CRUD operations
// Uses Firebase Firestore for data storage
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  fetchSubmissions,
  addSubmission as fbAdd,
  updateSubmission as fbUpdate,
  deleteSubmission as fbDelete,
} from "../utils/firebase";

export function useSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Initial load ─────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSubmissions();
        setSubmissions(data);
      } catch (err) {
        console.error("Firebase read failed:", err.message);
        setError("Failed to load data from database.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Add ──────────────────────────────────────────────────
  const addSubmission = useCallback(async (formData) => {
    try {
      const fbId = await fbAdd(formData);
      const newSub = {
        ...formData,
        id: fbId,
        timestamp: new Date().toISOString(), // Local optimistic timestamp
        createdAt: new Date().toISOString(),
      };
      setSubmissions((prev) => [newSub, ...prev]);
      return newSub;
    } catch (err) {
      console.error("Firebase write failed:", err.message);
      throw err;
    }
  }, []);

  // ── Update ───────────────────────────────────────────────
  const updateSubmission = useCallback(async (id, formData) => {
    try {
      await fbUpdate(id, formData);
      const updated = { ...formData, id, updatedAt: new Date().toISOString() };
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return updated;
    } catch (err) {
      console.error("Firebase update failed:", err.message);
      throw err;
    }
  }, []);

  // ── Delete ───────────────────────────────────────────────
  const removeSubmission = useCallback(async (id) => {
    try {
      await fbDelete(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Firebase delete failed:", err.message);
      throw err;
    }
  }, []);

  return {
    submissions,
    loading,
    error,
    addSubmission,
    updateSubmission,
    removeSubmission,
  };
}
