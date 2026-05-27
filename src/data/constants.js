// ============================================================
// constants.js — App-wide constants for Vivo TN Retail App
// ============================================================

/** 13 Tamil Nadu branches */
export const BRANCHES = [
  "Chennai Poorvika",
  "MT Chennai",
  "North Chennai",
  "South Chennai",
  "Vellore",
  "Pondicherry",
  "Madurai",
  "Virudhunagar",
  "Erode",
  "Salem",
  "Coimbatore",
  "Tirunelveli",
  "Trichy",
];

/** Retail activity types with metadata */
export const ACTIVITIES = [
  { id: "store_deco",  label: "Store Decoration",         icon: "🏪", color: "blue"   },
  { id: "back_drop",   label: "Back Drop",                icon: "🎨", color: "purple" },
  { id: "props",       label: "Props",                    icon: "🎭", color: "amber"  },
  { id: "cake",        label: "Cake Cutting",             icon: "🎂", color: "pink"   },
  { id: "promo",       label: "Promotion Material Placement", icon: "📢", color: "green" },
];

/** Sample campaign names */
export const CAMPAIGNS = [
  "Product Launch 2025",
  "Diwali Festival Campaign",
  "New Year Campaign",
  "Summer Sale",
  "Onam Special",
  "Pongal Activity",
  "Independence Day",
  "Republic Day Special",
];

/** Navigation menu items */
export const NAV_ITEMS = [
  { id: "form",        label: "Submit Activity",    icon: "ClipboardList" },
  { id: "dashboard",   label: "Admin Dashboard",    icon: "LayoutDashboard" },
  { id: "submissions", label: "All Submissions",    icon: "Table2" },
];

/** Status color mappings */
export const EXEC_STATUS = {
  high:   { min: 90, label: "On Track",   bg: "bg-green-100 dark:bg-green-900/40",  text: "text-green-700 dark:text-green-300" },
  medium: { min: 60, label: "In Progress",bg: "bg-amber-100 dark:bg-amber-900/40",  text: "text-amber-700 dark:text-amber-300" },
  low:    { min: 0,  label: "Behind",     bg: "bg-red-100 dark:bg-red-900/40",      text: "text-red-700 dark:text-red-300"   },
};

/** Returns execution status object based on percentage */
export function getExecStatus(pct) {
  if (pct >= 90) return EXEC_STATUS.high;
  if (pct >= 60) return EXEC_STATUS.medium;
  return EXEC_STATUS.low;
}

/** Chart color palette (Recharts-compatible) */
export const CHART_COLORS = [
  "#0052cc", "#10b981", "#f59e0b", "#8b5cf6",
  "#ef4444", "#06b6d4", "#f97316", "#6366f1",
];
