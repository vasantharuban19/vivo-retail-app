// ============================================================
// helpers.js — Shared utility functions
// ============================================================

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ACTIVITIES } from "../data/constants";

// ── Currency ─────────────────────────────────────────────────

/** Format number as Indian Rupee string e.g. ₹1,23,456 */
export function formatINR(value) {
  const num = parseFloat(value) || 0;
  return "₹" + num.toLocaleString("en-IN");
}

/** Format number as short form e.g. 45000 → ₹45K */
export function formatINRShort(value) {
  const num = parseFloat(value) || 0;
  if (num >= 100000) return "₹" + (num / 100000).toFixed(1) + "L";
  if (num >= 1000)   return "₹" + (num / 1000).toFixed(0) + "K";
  return "₹" + num;
}

// ── Budget calculations ───────────────────────────────────────

/** Remaining budget = allocated - spent */
export function remainingBudget(allocated, spent) {
  return (parseFloat(allocated) || 0) - (parseFloat(spent) || 0);
}

/** Spend percentage (0–100) */
export function spendPercent(allocated, spent) {
  const a = parseFloat(allocated) || 0;
  const s = parseFloat(spent) || 0;
  if (a === 0) return 0;
  return Math.min(Math.round((s / a) * 100), 100);
}

// ── Activity calculations ─────────────────────────────────────

/** Sum planned counts across all activities for a submission */
export function totalPlanned(activities) {
  return ACTIVITIES.reduce((sum, act) => sum + (parseInt(activities?.[act.id]?.planned) || 0), 0);
}

/** Sum executed counts across all activities for a submission */
export function totalExecuted(activities) {
  return ACTIVITIES.reduce((sum, act) => sum + (parseInt(activities?.[act.id]?.executed) || 0), 0);
}

/** Execution rate percentage */
export function execRate(activities) {
  const p = totalPlanned(activities);
  const e = totalExecuted(activities);
  if (p === 0) return 0;
  return Math.round((e / p) * 100);
}

/** Sum of activity-level budgets */
export function totalActivityBudget(activities) {
  return ACTIVITIES.reduce((sum, act) => sum + (parseFloat(activities?.[act.id]?.budget) || 0), 0);
}

// ── Form validation ───────────────────────────────────────────

/**
 * Validate the activity form.
 * Returns an errors object — empty means valid.
 */
export function validateForm(form) {
  const errors = {};
  if (!form.branch)              errors.branch        = "Branch is required";
  if (!form.date)                errors.date          = "Date is required";
  if (!form.campaign)            errors.campaign      = "Campaign is required";
  if (!form.submittedBy?.trim()) errors.submittedBy   = "Name is required";
  if (!form.budgetAllocated || parseFloat(form.budgetAllocated) <= 0)
                                 errors.budgetAllocated = "Enter a valid budget";
  if (form.budgetSpent === "" || form.budgetSpent === undefined || form.budgetSpent === null)
                                 errors.budgetSpent   = "Budget spent is required";
  return errors;
}

// ── Date helpers ──────────────────────────────────────────────

/** Today as YYYY-MM-DD */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Format ISO date string for display */
export function displayDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

// ── Duplicate detection ───────────────────────────────────────

/**
 * Returns true if a submission already exists for the same
 * branch + campaign (excluding editingId when editing).
 */
export function isDuplicate(submissions, branch, campaign, editingId = null) {
  return submissions.some(
    (s) => s.branch === branch && s.campaign === campaign && s.id !== editingId
  );
}

// ── Export helpers ────────────────────────────────────────────

/**
 * Export submissions array to Excel (.xlsx) file.
 * Includes both summary sheet and per-activity sheet.
 */
export function exportToExcel(submissions) {
  const summaryRows = submissions.map((s) => ({
    "Branch":            s.branch,
    "Date":              s.date,
    "Campaign":          s.campaign,
    "Submitted By":      s.submittedBy,
    "Budget Allocated":  s.budgetAllocated,
    "Budget Spent":      s.budgetSpent,
    "Remaining Budget":  remainingBudget(s.budgetAllocated, s.budgetSpent),
    "Execution Rate %":  execRate(s.activities),
    "Timestamp":         s.timestamp || s.createdAt || "",
  }));

  const activityRows = [];
  submissions.forEach((s) => {
    ACTIVITIES.forEach((act) => {
      const a = s.activities?.[act.id] || {};
      activityRows.push({
        "Branch":    s.branch,
        "Campaign":  s.campaign,
        "Activity":  act.label,
        "Planned":   a.planned  || 0,
        "Executed":  a.executed || 0,
        "Budget":    a.budget   || 0,
        "Exec Rate": a.planned > 0 ? Math.round((a.executed / a.planned) * 100) + "%" : "—",
      });
    });
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows),  "Summary");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activityRows), "Activity Details");
  XLSX.writeFile(wb, `Vivo_TN_Activity_Report_${todayISO()}.xlsx`);
}

/**
 * Export submissions array to PDF report.
 */
export function exportToPDF(submissions) {
  const doc = new jsPDF({ orientation: "landscape" });

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 82, 204);
  doc.text("Vivo Tamil Nadu — Retail Activity Report", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 28);

  // Summary table
  autoTable(doc, {
    startY: 34,
    head: [["Branch", "Date", "Campaign", "Submitted By", "Allocated", "Spent", "Remaining", "Exec %"]],
    body: submissions.map((s) => [
      s.branch,
      displayDate(s.date),
      s.campaign,
      s.submittedBy,
      formatINR(s.budgetAllocated),
      formatINR(s.budgetSpent),
      formatINR(remainingBudget(s.budgetAllocated, s.budgetSpent)),
      execRate(s.activities) + "%",
    ]),
    headStyles: { fillColor: [0, 82, 204] },
    alternateRowStyles: { fillColor: [232, 240, 253] },
    styles: { fontSize: 8 },
  });

  doc.save(`Vivo_TN_Activity_Report_${todayISO()}.pdf`);
}
