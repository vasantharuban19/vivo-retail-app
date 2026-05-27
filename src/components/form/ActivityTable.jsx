// ============================================================
// ActivityTable.jsx — Per-activity planned/executed/budget table
// ============================================================

import React from "react";
import { ACTIVITIES } from "../../data/constants";
import { Badge } from "../common/Common";

/** Rate badge based on execution percentage */
function RateBadge({ planned, executed }) {
  if (!planned || planned === 0) return <Badge variant="gray">—</Badge>;
  const pct = Math.round((executed / planned) * 100);
  const variant = pct >= 90 ? "green" : pct >= 60 ? "amber" : "red";
  return <Badge variant={variant}>{pct}%</Badge>;
}

export default function ActivityTable({ activities, onChange, readOnly = false }) {
  /** Totals row */
  const totalPlanned  = ACTIVITIES.reduce((s, a) => s + (parseInt(activities[a.id]?.planned)  || 0), 0);
  const totalExecuted = ACTIVITIES.reduce((s, a) => s + (parseInt(activities[a.id]?.executed) || 0), 0);
  const totalBudget   = ACTIVITIES.reduce((s, a) => s + (parseFloat(activities[a.id]?.budget) || 0), 0);

  const handleChange = (actId, field, value) => {
    if (readOnly) return;
    onChange(actId, field, value);
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-vivo-50 dark:bg-vivo-900/20">
              <th className="text-left px-4 py-3 font-semibold text-vivo-700 dark:text-vivo-400 uppercase text-[11px] tracking-wider rounded-tl-xl">
                Activity
              </th>
              <th className="text-right px-4 py-3 font-semibold text-vivo-700 dark:text-vivo-400 uppercase text-[11px] tracking-wider w-28">
                Planned
              </th>
              <th className="text-right px-4 py-3 font-semibold text-vivo-700 dark:text-vivo-400 uppercase text-[11px] tracking-wider w-28">
                Executed
              </th>
              <th className="text-right px-4 py-3 font-semibold text-vivo-700 dark:text-vivo-400 uppercase text-[11px] tracking-wider w-36">
                Budget Used (₹)
              </th>
              <th className="text-center px-4 py-3 font-semibold text-vivo-700 dark:text-vivo-400 uppercase text-[11px] tracking-wider w-24 rounded-tr-xl">
                Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITIES.map((act, idx) => {
              const av = activities[act.id] || {};
              return (
                <tr
                  key={act.id}
                  className={`border-t border-gray-50 dark:border-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/40 dark:bg-gray-800/20"}`}
                >
                  {/* Activity name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-vivo-50 dark:bg-vivo-900/30 flex items-center justify-center text-base">
                        {act.icon}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {act.label}
                      </span>
                    </div>
                  </td>

                  {/* Planned */}
                  <td className="px-4 py-3 text-right">
                    {readOnly ? (
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{av.planned || "—"}</span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={av.planned || ""}
                        onChange={(e) => handleChange(act.id, "planned", e.target.value)}
                        className="w-20 text-right px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border-[1.5px] border-gray-200 dark:border-gray-700 focus:border-vivo-500 focus:ring-[2px] focus:ring-vivo-100 dark:focus:ring-vivo-900/30 outline-none text-gray-900 dark:text-white transition-all duration-150"
                      />
                    )}
                  </td>

                  {/* Executed */}
                  <td className="px-4 py-3 text-right">
                    {readOnly ? (
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{av.executed || "—"}</span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={av.executed || ""}
                        onChange={(e) => handleChange(act.id, "executed", e.target.value)}
                        className="w-20 text-right px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border-[1.5px] border-gray-200 dark:border-gray-700 focus:border-vivo-500 focus:ring-[2px] focus:ring-vivo-100 dark:focus:ring-vivo-900/30 outline-none text-gray-900 dark:text-white transition-all duration-150"
                      />
                    )}
                  </td>

                  {/* Budget used */}
                  <td className="px-4 py-3 text-right">
                    {readOnly ? (
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {av.budget ? `₹${parseFloat(av.budget).toLocaleString("en-IN")}` : "—"}
                      </span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={av.budget || ""}
                        onChange={(e) => handleChange(act.id, "budget", e.target.value)}
                        className="w-28 text-right px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border-[1.5px] border-gray-200 dark:border-gray-700 focus:border-vivo-500 focus:ring-[2px] focus:ring-vivo-100 dark:focus:ring-vivo-900/30 outline-none text-gray-900 dark:text-white transition-all duration-150"
                      />
                    )}
                  </td>

                  {/* Rate badge */}
                  <td className="px-4 py-3 text-center">
                    <RateBadge
                      planned={parseInt(av.planned) || 0}
                      executed={parseInt(av.executed) || 0}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Totals row */}
          <tfoot>
            <tr className="bg-vivo-50/70 dark:bg-vivo-900/20 border-t-2 border-vivo-100 dark:border-vivo-900">
              <td className="px-4 py-3 font-bold text-vivo-700 dark:text-vivo-400 uppercase text-[11px] tracking-wider rounded-bl-xl">
                Totals
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{totalPlanned}</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{totalExecuted}</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                ₹{totalBudget.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3 text-center rounded-br-xl">
                <RateBadge planned={totalPlanned} executed={totalExecuted} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
