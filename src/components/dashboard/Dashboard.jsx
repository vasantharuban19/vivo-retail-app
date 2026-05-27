// ============================================================
// Dashboard.jsx — Admin analytics dashboard with charts
// ============================================================

import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { Download, FileText } from "lucide-react";
import { ACTIVITIES, BRANCHES, CHART_COLORS } from "../../data/constants";
import {
  formatINRShort, formatINR, execRate, totalPlanned, totalExecuted,
  spendPercent, exportToExcel, exportToPDF,
} from "../../utils/helpers";
import { StatCard, SectionHeader, Card, Button, ProgressBar, EmptyState } from "../common/Common";
import { useTheme } from "../../hooks/ThemeContext";

// ── Custom tooltip for charts ─────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-[12px]">
      <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" && p.value > 1000 ? formatINR(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard({ submissions }) {
  const { dark } = useTheme();
  const axisColor = dark ? "#4a5a7a" : "#9ca3af";

  // ── Aggregate stats ───────────────────────────────────────
  const stats = useMemo(() => {
    const totalAlloc   = submissions.reduce((s, x) => s + (x.budgetAllocated || 0), 0);
    const totalSpent   = submissions.reduce((s, x) => s + (x.budgetSpent     || 0), 0);
    const totalRem     = totalAlloc - totalSpent;
    const totalP       = submissions.reduce((s, x) => s + totalPlanned(x.activities),  0);
    const totalE       = submissions.reduce((s, x) => s + totalExecuted(x.activities), 0);
    const execR        = totalP > 0 ? Math.round((totalE / totalP) * 100) : 0;
    return { totalAlloc, totalSpent, totalRem, totalP, totalE, execR };
  }, [submissions]);

  // ── Branch budget chart data ──────────────────────────────
  const branchChartData = useMemo(() => {
    const map = {};
    submissions.forEach((s) => {
      if (!map[s.branch]) map[s.branch] = { name: s.branch.replace(" ", "\n"), allocated: 0, spent: 0 };
      map[s.branch].allocated += s.budgetAllocated || 0;
      map[s.branch].spent     += s.budgetSpent     || 0;
    });
    return Object.values(map).map((d) => ({ ...d, name: d.name.split("\n")[0].slice(0, 10) }));
  }, [submissions]);

  // ── Activity chart data ───────────────────────────────────
  const activityChartData = useMemo(() => {
    const map = {};
    ACTIVITIES.forEach((a) => { map[a.id] = { name: a.label.slice(0, 14), planned: 0, executed: 0 }; });
    submissions.forEach((s) => {
      ACTIVITIES.forEach((a) => {
        map[a.id].planned  += parseInt(s.activities?.[a.id]?.planned)  || 0;
        map[a.id].executed += parseInt(s.activities?.[a.id]?.executed) || 0;
      });
    });
    return Object.values(map);
  }, [submissions]);

  // ── Campaign pie data ─────────────────────────────────────
  const campaignPieData = useMemo(() => {
    const map = {};
    submissions.forEach((s) => {
      const k = s.campaign || "Unknown";
      if (!map[k]) map[k] = 0;
      map[k] += s.budgetSpent || 0;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [submissions]);

  // ── Exec rate per branch ──────────────────────────────────
  const branchExecData = useMemo(() => {
    return submissions.map((s) => ({
      branch: s.branch,
      rate:   execRate(s.activities),
      spent:  spendPercent(s.budgetAllocated, s.budgetSpent),
    }));
  }, [submissions]);

  if (submissions.length === 0) {
    return <EmptyState title="No submissions yet" sub="Submit the first retail activity report to see analytics here." />;
  }

  return (
    <div className="page-content space-y-6">
      {/* ── KPI Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Allocated"
          value={formatINRShort(stats.totalAlloc)}
          sub={`${submissions.length} submissions`}
          icon="💰"
          accentColor="#0052cc"
        />
        <StatCard
          label="Total Spent"
          value={formatINRShort(stats.totalSpent)}
          sub={`${spendPercent(stats.totalAlloc, stats.totalSpent)}% spend rate`}
          icon="📊"
          accentColor="#f59e0b"
          progress={spendPercent(stats.totalAlloc, stats.totalSpent)}
        />
        <StatCard
          label="Remaining Budget"
          value={formatINRShort(Math.abs(stats.totalRem))}
          sub={stats.totalRem >= 0 ? "Under budget ✅" : "Overspent ⚠️"}
          icon="💵"
          accentColor={stats.totalRem >= 0 ? "#10b981" : "#ef4444"}
        />
        <StatCard
          label="Execution Rate"
          value={`${stats.execR}%`}
          sub={`${stats.totalE} / ${stats.totalP} activities`}
          icon="🎯"
          accentColor="#8b5cf6"
          progress={stats.execR}
        />
      </div>

      {/* ── Charts row 1 ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Branch budget chart */}
        <Card>
          <SectionHeader title="Budget by Branch" />
          <div className="flex gap-4 mb-3">
            {[["#0052cc","Allocated"],["#f59e0b","Spent"]].map(([color, label]) => (
              <span key={label} className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400">
                <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={branchChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e2d4a" : "#f0f4ff"} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} />
              <YAxis tickFormatter={(v) => formatINRShort(v)} tick={{ fontSize: 11, fill: axisColor }} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="allocated" name="Allocated" fill="#0052cc" radius={[4,4,0,0]} maxBarSize={28} />
              <Bar dataKey="spent"     name="Spent"     fill="#f59e0b" radius={[4,4,0,0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity planned vs executed */}
        <Card>
          <SectionHeader title="Activity Execution" />
          <div className="flex gap-4 mb-3">
            {[["#8b5cf6","Planned"],["#10b981","Executed"]].map(([color, label]) => (
              <span key={label} className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400">
                <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={activityChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e2d4a" : "#f0f4ff"} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="planned"  name="Planned"  fill="#8b5cf6" radius={[4,4,0,0]} maxBarSize={28} />
              <Bar dataKey="executed" name="Executed" fill="#10b981" radius={[4,4,0,0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Charts row 2 ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Campaign pie */}
        <Card>
          <SectionHeader title="Campaign Budget Distribution" />
          <div className="flex flex-wrap gap-3 mb-2">
            {campaignPieData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="w-3 h-3 rounded-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {d.name.slice(0, 18)}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={campaignPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                dataKey="value" paddingAngle={3}>
                {campaignPieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatINR(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Branch execution rates */}
        <Card>
          <SectionHeader title="Branch Execution Rates" />
          <div className="space-y-3 mt-1">
            {branchExecData.map((b) => (
              <div key={b.branch}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] text-gray-700 dark:text-gray-300 font-medium">{b.branch}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">Spend: {b.spent}%</span>
                    <span className={`text-[12px] font-bold ${b.rate >= 90 ? "text-green-600" : b.rate >= 60 ? "text-amber-600" : "text-red-500"}`}>
                      {b.rate}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={b.rate}
                  color={b.rate >= 90 ? "bg-green-500" : b.rate >= 60 ? "bg-amber-500" : "bg-red-500"}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Export buttons ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 pt-2 no-print">
        <Button variant="secondary" onClick={() => exportToExcel(submissions)}>
          <Download size={15} /> Export to Excel
        </Button>
        <Button variant="ghost" onClick={() => exportToPDF(submissions)}>
          <FileText size={15} /> Export PDF Report
        </Button>
      </div>
    </div>
  );
}
