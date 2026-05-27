// ============================================================
// App.jsx — Root component: layout shell + routing between views
// ============================================================

import React, { useState, useCallback } from "react";
import { ThemeProvider } from "./hooks/ThemeContext";
import { useSubmissions } from "./hooks/useSubmissions";
import Sidebar  from "./components/layout/Sidebar";
import Topbar   from "./components/layout/Topbar";
import ActivityForm  from "./components/form/ActivityForm";
import Dashboard     from "./components/dashboard/Dashboard";
import Submissions   from "./components/submissions/Submissions";
import { Spinner }   from "./components/common/Common";
import "./styles/index.css";

function AppInner() {
  const [view, setView]         = useState("form");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [editingData, setEditingData] = useState(null);

  const { submissions, loading, error, addSubmission, updateSubmission, removeSubmission } =
    useSubmissions();

  // ── Submit handler (new or update) ─────────────────────────
  const handleSubmit = useCallback(async (formData) => {
    if (editingId) {
      await updateSubmission(editingId, formData);
      setEditingId(null);
      setEditingData(null);
      setView("submissions"); // Return to list after edit
    } else {
      await addSubmission(formData);
    }
  }, [editingId, addSubmission, updateSubmission]);

  // ── Edit handler (load submission into form) ────────────────
  const handleEdit = useCallback((submission) => {
    setEditingId(submission.id);
    setEditingData({ ...submission });
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Cancel edit ─────────────────────────────────────────────
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingData(null);
    setView("submissions");
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      {/* Desktop: always visible */}
      <div className="hidden lg:flex lg:w-[240px] lg:fixed lg:inset-y-0 lg:flex-col">
        <Sidebar
          view={view}
          setView={(v) => { setView(v); setEditingId(null); setEditingData(null); }}
          submissionCount={submissions.length}
        />
      </div>

      {/* Mobile: drawer overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[240px] flex flex-col lg:hidden">
            <Sidebar
              view={view}
              setView={(v) => { setView(v); setEditingId(null); setEditingData(null); setSidebarOpen(false); }}
              submissionCount={submissions.length}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[240px]">
        <Topbar
          view={view}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Offline/error notice */}
        {error && (
          <div className="mx-6 mt-4 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-[12px] text-amber-700 dark:text-amber-400">
            ⚠ {error}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-7">
          {loading ? (
            <div className="flex items-center justify-center h-64 gap-3">
              <Spinner size={28} />
              <p className="text-gray-400 dark:text-gray-500">Loading submissions…</p>
            </div>
          ) : (
            <>
              {view === "form" && (
                <ActivityForm
                  submissions={submissions}
                  onSubmit={handleSubmit}
                  editingId={editingId}
                  editingData={editingData}
                  onCancelEdit={handleCancelEdit}
                />
              )}
              {view === "dashboard" && (
                <Dashboard submissions={submissions} />
              )}
              {view === "submissions" && (
                <Submissions
                  submissions={submissions}
                  onEdit={handleEdit}
                  onDelete={removeSubmission}
                />
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[11px] text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} Vivo Tamil Nadu Operations &nbsp;·&nbsp; Retail Activity Manager v1.0
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
