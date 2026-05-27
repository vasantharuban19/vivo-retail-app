// ============================================================
// Submissions.jsx — All submissions with filter/search/edit/delete
// ============================================================

import React, { useState, useMemo } from "react";
import { Search, Edit2, Trash2, ChevronDown, ChevronUp, Download } from "lucide-react";
import { BRANCHES, CAMPAIGNS } from "../../data/constants";
import {
  formatINR, displayDate, execRate, spendPercent, exportToExcel, exportToPDF,
} from "../../utils/helpers";
import {
  Card, Button, Badge, Input, Select, SectionHeader, EmptyState, Divider,
} from "../common/Common";
import ActivityTable from "../form/ActivityTable";

export default function Submissions({ submissions, onEdit, onDelete }) {
  const [search,         setSearch]         = useState("");
  const [filterBranch,   setFilterBranch]   = useState("");
  const [filterCampaign, setFilterCampaign] = useState("");
  const [filterDate,     setFilterDate]     = useState("");
  const [expandedId,     setExpandedId]     = useState(null);
  const [sortField,      setSortField]      = useState("timestamp");
  const [sortDir,        setSortDir]        = useState("desc");

  // ── Filter + search ───────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...submissions];
    if (filterBranch)   list = list.filter((s) => s.branch   === filterBranch);
    if (filterCampaign) list = list.filter((s) => s.campaign === filterCampaign);
    if (filterDate)     list = list.filter((s) => s.date     === filterDate);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.branch?.toLowerCase().includes(q) ||
        s.campaign?.toLowerCase().includes(q) ||
        s.submittedBy?.toLowerCase().includes(q)
      );
    }
    // Sort
    list.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [submissions, filterBranch, filterCampaign, filterDate, search, sortField, sortDir]);

  const clearFilters = () => {
    setSearch(""); setFilterBranch(""); setFilterCampaign(""); setFilterDate("");
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={12} className="opacity-30" />;
    return sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="page-content">
      {/* ── Filter bar ────────────────────────────────────── */}
      <Card className="mb-5">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search branch, campaign, person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="w-auto min-w-[150px]">
            <option value="">All Branches</option>
            {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </Select>

          <Select value={filterCampaign} onChange={(e) => setFilterCampaign(e.target.value)} className="w-auto min-w-[160px]">
            <option value="">All Campaigns</option>
            {CAMPAIGNS.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>

          <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-auto" />

          <Button variant="ghost" size="sm" onClick={clearFilters}>✕ Clear</Button>

          <Button variant="secondary" size="sm" onClick={() => exportToExcel(filtered)}>
            <Download size={13} /> Export
          </Button>
        </div>
      </Card>

      {/* ── Results count ─────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] text-gray-500 dark:text-gray-400">
          Showing <strong className="text-gray-700 dark:text-gray-300">{filtered.length}</strong> of{" "}
          <strong className="text-gray-700 dark:text-gray-300">{submissions.length}</strong> submissions
        </p>
      </div>

      {/* ── Table ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState title="No submissions found" sub="Try adjusting your search or filters." />
      ) : (
        <Card noPad>
          {/* Column headers */}
          <div className="hidden md:grid grid-cols-[1.4fr_1fr_1.6fr_1fr_1fr_0.8fr_80px] gap-3 px-4 py-3 bg-vivo-50 dark:bg-vivo-900/20 rounded-t-xl border-b border-gray-100 dark:border-gray-800">
            {[
              ["Branch",      "branch"],
              ["Date",        "date"],
              ["Campaign",    "campaign"],
              ["Allocated",   "budgetAllocated"],
              ["Spent",       "budgetSpent"],
              ["Exec %",      null],
              ["Actions",     null],
            ].map(([label, field]) => (
              <button
                key={label}
                onClick={() => field && toggleSort(field)}
                className={`text-left text-[11px] font-semibold uppercase tracking-wider text-vivo-700 dark:text-vivo-400 flex items-center gap-1 ${field ? "cursor-pointer hover:text-vivo-900" : "cursor-default"}`}
              >
                {label}
                {field && <SortIcon field={field} />}
              </button>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50 dark:divide-gray-800/70">
            {filtered.map((s) => {
              const rem      = s.budgetAllocated - s.budgetSpent;
              const spendPct = spendPercent(s.budgetAllocated, s.budgetSpent);
              const execPct  = execRate(s.activities);
              const isExpanded = expandedId === s.id;

              return (
                <React.Fragment key={s.id}>
                  {/* Main row */}
                  <div
                    className="
                      grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1.6fr_1fr_1fr_0.8fr_80px]
                      gap-3 px-4 py-3 items-center
                      hover:bg-gray-50 dark:hover:bg-gray-800/40
                      transition-colors duration-100 cursor-pointer
                    "
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  >
                    {/* Branch + person */}
                    <div>
                      <p className="font-semibold text-[13px] text-gray-900 dark:text-white">{s.branch}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{s.submittedBy}</p>
                    </div>

                    {/* Date */}
                    <p className="text-[13px] text-gray-600 dark:text-gray-400">{displayDate(s.date)}</p>

                    {/* Campaign */}
                    <div>
                      <p className="text-[13px] text-gray-800 dark:text-gray-200 truncate">{s.campaign}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">Spend: {spendPct}%</p>
                    </div>

                    {/* Allocated */}
                    <p className="font-semibold text-[13px] text-gray-800 dark:text-gray-200">
                      {formatINR(s.budgetAllocated)}
                    </p>

                    {/* Spent + remaining */}
                    <div>
                      <p className="font-semibold text-[13px] text-gray-800 dark:text-gray-200">
                        {formatINR(s.budgetSpent)}
                      </p>
                      <p className={`text-[11px] font-medium ${rem >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                        {rem >= 0 ? "+" : "-"}{formatINR(Math.abs(rem))}
                      </p>
                    </div>

                    {/* Exec rate */}
                    <Badge variant={execPct >= 90 ? "green" : execPct >= 60 ? "amber" : "red"}>
                      {execPct}%
                    </Badge>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        title="Edit"
                        onClick={() => onEdit(s)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-vivo-50 dark:bg-vivo-900/30 text-vivo-600 dark:text-vivo-400 hover:bg-vivo-100 transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => { if (window.confirm("Delete this submission?")) onDelete(s.id); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail row */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-vivo-50/40 dark:bg-vivo-900/10 border-t border-vivo-100 dark:border-vivo-900/30">
                      <p className="text-[12px] font-semibold text-vivo-600 dark:text-vivo-400 uppercase tracking-wider py-3">
                        Activity Breakdown
                      </p>
                      <ActivityTable activities={s.activities} onChange={() => {}} readOnly />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
