// ============================================================
// Topbar.jsx — Top navigation bar with page title
// ============================================================

import React from "react";
import { Menu, Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "../../hooks/ThemeContext";

const PAGE_META = {
  form:        { title: "Submit Retail Activity",   sub: "Fill in campaign activity details for your branch" },
  dashboard:   { title: "Admin Dashboard",          sub: "Campaign performance & budget analytics" },
  submissions: { title: "All Submissions",          sub: "View, edit and manage all activity entries" },
};

export default function Topbar({ view, onMenuClick }) {
  const { dark, toggle } = useTheme();
  const meta = PAGE_META[view] || PAGE_META.form;

  return (
    <header className="
      sticky top-0 z-40
      h-[60px] flex items-center justify-between px-6
      bg-white dark:bg-gray-900
      border-b border-gray-100 dark:border-gray-800
      shadow-sm
    ">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight">
            {meta.title}
          </h1>
          <p className="text-[12px] text-gray-400 dark:text-gray-500 hidden sm:block">
            {meta.sub}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Date */}
        <span className="hidden md:block text-[12px] text-gray-400 dark:text-gray-500 font-medium mr-2">
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>

        {/* Notification bell (UI only) */}
        <button className="
          w-9 h-9 flex items-center justify-center rounded-lg
          border border-gray-200 dark:border-gray-700
          text-gray-500 dark:text-gray-400
          hover:bg-vivo-50 dark:hover:bg-gray-800
          hover:border-vivo-300 hover:text-vivo-600
          transition-all duration-150
        ">
          <Bell size={16} />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="
            w-9 h-9 flex items-center justify-center rounded-lg
            border border-gray-200 dark:border-gray-700
            text-gray-500 dark:text-gray-400
            hover:bg-vivo-50 dark:hover:bg-gray-800
            hover:border-vivo-300 hover:text-vivo-600
            transition-all duration-150
          "
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
