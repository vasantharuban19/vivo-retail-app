// ============================================================
// Common.jsx — Shared reusable UI components
// ============================================================

import React from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

// ── Stat Card ────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, accentColor = "#0052cc", progress }) {
  return (
    <div className="
      relative overflow-hidden
      bg-white dark:bg-gray-900
      border border-gray-100 dark:border-gray-800
      rounded-xl p-5 shadow-card
    ">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accentColor }} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            {label}
          </p>
          <p className="text-[26px] font-extrabold text-gray-900 dark:text-white leading-none">
            {value}
          </p>
          {sub && (
            <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-1.5">{sub}</p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ background: accentColor + "18" }}>
            {icon}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mt-3 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%`, background: accentColor }}
          />
        </div>
      )}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────
export function SectionHeader({ title, badge, children }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-[5px] h-6 bg-vivo-600 rounded-full" />
        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">{title}</h2>
        {badge !== undefined && (
          <span className="bg-vivo-50 dark:bg-vivo-900/30 text-vivo-600 dark:text-vivo-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────
export function Card({ children, className = "", noPad }) {
  return (
    <div className={`
      bg-white dark:bg-gray-900
      border border-gray-100 dark:border-gray-800
      rounded-xl shadow-card
      ${noPad ? "" : "p-5"}
      ${className}
    `}>
      {children}
    </div>
  );
}

// ── Form Field ───────────────────────────────────────────────
export function FormField({ label, required, error, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <AlertTriangle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────
export function Input({ error, className = "", ...props }) {
  return (
    <input
      className={`
        w-full px-3 py-2.5 rounded-lg text-[14px]
        bg-gray-50 dark:bg-gray-800
        border-[1.5px] ${error
          ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30"
          : "border-gray-200 dark:border-gray-700 focus:border-vivo-500 focus:ring-vivo-100 dark:focus:ring-vivo-900/30"
        }
        text-gray-900 dark:text-white
        placeholder:text-gray-400
        outline-none focus:ring-[3px]
        transition-all duration-150
        ${className}
      `}
      {...props}
    />
  );
}

// ── Select ────────────────────────────────────────────────────
export function Select({ error, className = "", children, ...props }) {
  return (
    <select
      className={`
        w-full px-3 py-2.5 rounded-lg text-[14px]
        bg-gray-50 dark:bg-gray-800
        border-[1.5px] ${error
          ? "border-red-400 focus:border-red-500"
          : "border-gray-200 dark:border-gray-700 focus:border-vivo-500"
        }
        text-gray-900 dark:text-white
        outline-none focus:ring-[3px] ${error ? "focus:ring-red-100" : "focus:ring-vivo-100 dark:focus:ring-vivo-900/30"}
        transition-all duration-150
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}

// ── Button ────────────────────────────────────────────────────
export function Button({ variant = "primary", size = "md", children, className = "", ...props }) {
  const base = "inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes = {
    sm: "px-3 py-1.5 text-[12px]",
    md: "px-4 py-2.5 text-[14px]",
    lg: "px-6 py-3 text-[15px]",
  };

  const variants = {
    primary:   "bg-vivo-600 hover:bg-vivo-700 active:scale-[0.98] text-white shadow-md hover:shadow-lg",
    secondary: "bg-vivo-50 dark:bg-vivo-900/20 hover:bg-vivo-100 dark:hover:bg-vivo-900/40 text-vivo-700 dark:text-vivo-400 border border-vivo-200 dark:border-vivo-800",
    ghost:     "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
    danger:    "bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ children, variant = "blue", size = "sm" }) {
  const variants = {
    blue:   "bg-vivo-50 dark:bg-vivo-900/30 text-vivo-700 dark:text-vivo-400",
    green:  "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    amber:  "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    red:    "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    gray:   "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold
      ${size === "sm" ? "text-[11px]" : "text-[13px]"}
      ${variants[variant]}
    `}>
      {children}
    </span>
  );
}

// ── Alert / Warning banner ────────────────────────────────────
export function Alert({ type = "warning", children }) {
  const styles = {
    warning: { bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300", Icon: AlertTriangle },
    info:    { bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300",   Icon: Info },
    success: { bg: "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300", Icon: CheckCircle2 },
  };
  const { bg, Icon } = styles[type];
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border text-[13px] ${bg} mb-4`}>
      <Icon size={16} className="mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
export function EmptyState({ title = "No data found", sub = "No results match your criteria." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-3xl">
        📋
      </div>
      <p className="text-[15px] font-semibold text-gray-700 dark:text-gray-300">{title}</p>
      <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────
export function Divider() {
  return <hr className="border-t border-gray-100 dark:border-gray-800 my-5" />;
}

// ── Loading spinner ───────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <div
      className="border-[3px] border-vivo-200 border-t-vivo-600 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}

// ── Progress bar ──────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = "bg-vivo-600" }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
