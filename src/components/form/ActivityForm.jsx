// ============================================================
// ActivityForm.jsx — Main form for submitting retail activities
// ============================================================

import React, { useState, useEffect } from "react";
import { RotateCcw, Send, AlertTriangle } from "lucide-react";
import { BRANCHES, CAMPAIGNS, ACTIVITIES } from "../../data/constants";
import {
  validateForm, remainingBudget, todayISO, isDuplicate, formatINR,
} from "../../utils/helpers";
import {
  Card, FormField, Input, Select, Button,
  SectionHeader, Alert, Divider,
} from "../common/Common";
import ActivityTable from "./ActivityTable";
import SuccessModal from "./SuccessModal";

/** Build a blank activities object */
function emptyActivities() {
  return Object.fromEntries(ACTIVITIES.map((a) => [a.id, { planned: "", executed: "", budget: "" }]));
}

/** Build a blank form */
function emptyForm() {
  return {
    branch: "", date: todayISO(), campaign: "", submittedBy: "",
    budgetAllocated: "", budgetSpent: "",
    activities: emptyActivities(),
  };
}

export default function ActivityForm({ submissions, onSubmit, editingId, editingData, onCancelEdit }) {
  const [form,    setForm]    = useState(editingData ? { ...editingData } : emptyForm());
  const [errors,  setErrors]  = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDup, setIsDup] = useState(false);

  // When editing data changes (from parent), reload form
  useEffect(() => {
    if (editingData) setForm({ ...editingData });
    else setForm(emptyForm());
    setErrors({});
  }, [editingData, editingId]);

  // Check for duplicate on branch/campaign change
  useEffect(() => {
    if (form.branch && form.campaign) {
      setIsDup(isDuplicate(submissions, form.branch, form.campaign, editingId));
    } else {
      setIsDup(false);
    }
  }, [form.branch, form.campaign, submissions, editingId]);

  // ── Field update handlers ─────────────────────────────────
  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setActivity = (actId, field, value) => {
    setForm((prev) => ({
      ...prev,
      activities: { ...prev.activities, [actId]: { ...prev.activities[actId], [field]: value } },
    }));
  };

  // ── Computed values ───────────────────────────────────────
  const remaining  = remainingBudget(form.budgetAllocated, form.budgetSpent);
  const isOverspent = remaining < 0;

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    onSubmit({ ...form, budgetAllocated: parseFloat(form.budgetAllocated), budgetSpent: parseFloat(form.budgetSpent) });
    if (!editingId) {
      setShowSuccess(true);
      setForm(emptyForm());
    }
    setErrors({});
  };

  // ── Reset ─────────────────────────────────────────────────
  const handleReset = () => {
    setForm(editingData ? { ...editingData } : emptyForm());
    setErrors({});
  };

  return (
    <div className="max-w-3xl mx-auto page-content pb-8">
      {/* Duplicate warning */}
      {isDup && (
        <Alert type="warning">
          <strong>Duplicate detected:</strong> A submission for{" "}
          <em>{form.branch}</em> on <em>{form.campaign}</em> already exists.
          You can still submit or{" "}
          <button className="underline font-semibold" onClick={() => {}}>
            edit the existing entry
          </button>.
        </Alert>
      )}

      {/* ── Section 1: Basic Details ─────────────────────── */}
      <Card>
        <SectionHeader title="Basic Details">
          <span className="text-[12px] text-gray-400 dark:text-gray-500">
            {editingId ? "✏️ Editing Submission" : "All fields marked * are required"}
          </span>
        </SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Branch Name" required error={errors.branch}>
            <Select value={form.branch} onChange={(e) => setField("branch", e.target.value)} error={errors.branch}>
              <option value="">— Select Branch —</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>
          </FormField>

          <FormField label="Date" required error={errors.date}>
            <Input type="date" value={form.date} onChange={(e) => setField("date", e.target.value)} error={errors.date} />
          </FormField>

          <FormField label="Campaign / Project Name" required error={errors.campaign}>
            <Select value={form.campaign} onChange={(e) => setField("campaign", e.target.value)} error={errors.campaign}>
              <option value="">— Select Campaign —</option>
              {CAMPAIGNS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>

          <FormField label="Submitted By" required error={errors.submittedBy}>
            <Input
              type="text"
              placeholder="Your full name"
              value={form.submittedBy}
              onChange={(e) => setField("submittedBy", e.target.value)}
              error={errors.submittedBy}
            />
          </FormField>
        </div>
      </Card>

      {/* ── Section 2: Budget Details ─────────────────────── */}
      <div className="mt-5">
        <SectionHeader title="Budget Details" />
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Budget Allocated (₹)" required error={errors.budgetAllocated}>
              <Input
                type="number" min="0" placeholder="0.00"
                value={form.budgetAllocated}
                onChange={(e) => setField("budgetAllocated", e.target.value)}
                error={errors.budgetAllocated}
              />
            </FormField>

            <FormField label="Budget Spent (₹)" required error={errors.budgetSpent}>
              <Input
                type="number" min="0" placeholder="0.00"
                value={form.budgetSpent}
                onChange={(e) => setField("budgetSpent", e.target.value)}
                error={errors.budgetSpent}
              />
            </FormField>

            <FormField label="Remaining Budget (₹)" hint="Auto-calculated">
              <div className={`
                px-3 py-2.5 rounded-lg text-[14px] font-bold
                border-[1.5px]
                ${isOverspent
                  ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400"
                  : "bg-vivo-50 dark:bg-vivo-900/20 border-vivo-200 dark:border-vivo-800 text-vivo-700 dark:text-vivo-400"
                }
              `}>
                {form.budgetAllocated || form.budgetSpent
                  ? isOverspent
                    ? `⚠ Overspent by ${formatINR(Math.abs(remaining))}`
                    : formatINR(remaining)
                  : "—"
                }
              </div>
            </FormField>
          </div>
        </Card>
      </div>

      {/* ── Section 3: Activity Execution ─────────────────── */}
      <div className="mt-5">
        <SectionHeader title="Activity Execution" badge={ACTIVITIES.length} />
        <ActivityTable
          activities={form.activities}
          onChange={setActivity}
        />
      </div>

      {/* ── Actions ──────────────────────────────────────── */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
        {editingId && (
          <Button variant="ghost" onClick={onCancelEdit}>
            Cancel Edit
          </Button>
        )}
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw size={15} /> Reset Form
        </Button>
        <Button variant="primary" size="lg" onClick={handleSubmit} className="sm:min-w-[200px] justify-center">
          <Send size={16} />
          {editingId ? "Update Submission" : "Submit Activity Report"}
        </Button>
      </div>

      {/* Success modal */}
      {showSuccess && (
        <SuccessModal
          branch={form.branch}
          campaign={form.campaign}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
