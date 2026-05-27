// ============================================================
// Sidebar.jsx — Left navigation sidebar with Vivo branding
// ============================================================

import React from "react";
import {
  ClipboardList, LayoutDashboard, Table2,
  Moon, Sun, X, ChevronRight,
} from "lucide-react";
import { useTheme } from "../../hooks/ThemeContext";

const ICON_MAP = { ClipboardList, LayoutDashboard, Table2 };

const NAV_ITEMS = [
  { id: "form",        label: "Submit Activity",  icon: "ClipboardList",   sub: "Field data entry" },
  { id: "dashboard",   label: "Admin Dashboard",  icon: "LayoutDashboard", sub: "Analytics & charts" },
  { id: "submissions", label: "All Submissions",  icon: "Table2",          sub: "View & manage" },
];

export default function Sidebar({ view, setView, submissionCount, onClose }) {
  const { dark, toggle } = useTheme();

  return (
    <aside className="
      flex flex-col h-full
      bg-[#001840] dark:bg-[#060c1a]
      border-r border-white/5
    ">
      {/* ── Logo ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/7">
        <div className="flex items-center gap-3">
          {/* Vivo "V" badge */}
          <div className="w-9 h-9 rounded-lg bg-vivo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-lg tracking-tighter">V</span>
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-tight">vivo TN Ops</p>
            <p className="text-blue-300/60 text-[11px]">Retail Activity Manager</p>
          </div>
        </div>
        {/* Close button — visible on mobile */}
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white p-1 lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
          Main
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setView(item.id); onClose?.(); }}
              className={`
                w-full flex items-center gap-3 px-5 py-3 text-left
                transition-all duration-150
                border-l-[3px]
                ${active
                  ? "bg-vivo-600/20 border-vivo-400 text-white"
                  : "border-transparent text-blue-200/60 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Icon size={17} className={active ? "text-vivo-400" : ""} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold leading-tight">{item.label}</p>
                <p className={`text-[11px] ${active ? "text-blue-300/70" : "text-white/30"}`}>
                  {item.sub}
                </p>
              </div>
              {item.id === "submissions" && submissionCount > 0 && (
                <span className="bg-vivo-600/30 text-vivo-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {submissionCount}
                </span>
              )}
              {active && <ChevronRight size={14} className="text-vivo-400" />}
            </button>
          );
        })}

        {/* ── Settings section ─────────────────────────────── */}
        <p className="px-5 mt-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
          Settings
        </p>
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-5 py-3 text-blue-200/60 hover:text-white hover:bg-white/5 transition-colors duration-150 border-l-[3px] border-transparent"
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
          <span className="text-[13px] font-semibold">{dark ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </nav>

      {/* ── User chip ──────────────────────────────────────── */}
      <div className="px-5 py-4 border-t border-white/7">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-vivo-600 flex items-center justify-center text-white font-bold text-[12px]">
            TN
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold">TN Operations</p>
            <p className="text-blue-300/50 text-[11px]">Regional Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
