"use client";

import React, { useState, useEffect, useRef } from "react";
import { Download, Sparkles, TrendingUp, TrendingDown, UploadCloud, RefreshCw, Loader2, CheckCircle2, X, ChevronDown } from "lucide-react";

const timeframeData: Record<string, { chartData: { label: string; org: number; inf: number; highlight?: boolean }[]; metrics: { detections: string; violations: string; fingerprints: string; revenue: string } }> = {
  "7D": {
    chartData: [
      { label: "MON", org: 40, inf: 20 },
      { label: "TUE", org: 60, inf: 35 },
      { label: "WED", org: 55, inf: 80 },
      { label: "THU", org: 100, inf: 25, highlight: true },
      { label: "FRI", org: 70, inf: 30 },
      { label: "SAT", org: 50, inf: 75 },
      { label: "SUN", org: 45, inf: 85 },
    ],
    metrics: { detections: "124.8k", violations: "8.4k", fingerprints: "1.2M", revenue: "$240k" },
  },
  "30D": {
    chartData: [
      { label: "W1", org: 55, inf: 45 },
      { label: "W2", org: 75, inf: 60 },
      { label: "W3", org: 90, inf: 40, highlight: true },
      { label: "W4", org: 65, inf: 70 },
    ],
    metrics: { detections: "512k", violations: "31.2k", fingerprints: "4.8M", revenue: "$980k" },
  },
  "90D": {
    chartData: [
      { label: "JAN", org: 50, inf: 30 },
      { label: "FEB", org: 70, inf: 55 },
      { label: "MAR", org: 95, inf: 20, highlight: true },
      { label: "APR", org: 80, inf: 65 },
      { label: "MAY", org: 60, inf: 80 },
      { label: "JUN", org: 85, inf: 40 },
    ],
    metrics: { detections: "1.48M", violations: "93.1k", fingerprints: "14.2M", revenue: "$2.9M" },
  },
  "YTD": {
    chartData: [
      { label: "Q1", org: 65, inf: 40 },
      { label: "Q2", org: 80, inf: 55 },
      { label: "Q3", org: 95, inf: 30, highlight: true },
      { label: "Q4", org: 75, inf: 70 },
    ],
    metrics: { detections: "5.9M", violations: "372k", fingerprints: "56M", revenue: "$11.6M" },
  },
};

const platformsData = [
  { label: "Video Streaming", val: "14,203", pct: 85 },
  { label: "Social Feeds", val: "9,842", pct: 60 },
  { label: "Encrypted Messaging", val: "4,110", pct: 25 },
  { label: "Archival Storage", val: "2,442", pct: 15 },
];

const infringingPlatforms = [
  { icon: "YT", title: "YouTube.com", sub: "Video Streaming Cluster", incidents: "2,412" },
  { icon: "TG", title: "Telegram Channels", sub: "Messaging & File Share", incidents: "1,894" },
  { icon: "IG", title: "Instagram", sub: "Reels & Media Feed", incidents: "1,203" },
];

export default function Reports() {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D" | "YTD">("7D");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "loading" | "done">("idle");
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [investigateModal, setInvestigateModal] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [barAnimated, setBarAnimated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [viewAllPlatforms, setViewAllPlatforms] = useState(false);

  const data = timeframeData[timeframe];

  useEffect(() => {
    setBarAnimated(false);
    const t = setTimeout(() => setBarAnimated(true), 50);
    return () => clearTimeout(t);
  }, [timeframe]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); showToast("Data refreshed successfully!"); }, 1800);
  };

  const handleExport = () => {
    setExportState("loading");
    setTimeout(() => {
      setExportState("done");
      showToast("Report exported as PDF!");
      setTimeout(() => setExportState("idle"), 3000);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-2 md:p-6 lg:p-8 animate-in fade-in duration-500 relative">

      {/* Toast */}
      {toast && (
        <div className="toast-notification fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border border-emerald-500 bg-emerald-600 text-white dark:text-white text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300">
           <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-white" /> 
           <span className="text-slate-900 dark:text-white">{toast}</span>
        </div>
      )}

      {/* Investigate Modal */}
      {investigateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setInvestigateModal(false)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">Southeast Asia Investigation</h3>
              <button onClick={() => setInvestigateModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-600 dark:text-n-3 mb-6 leading-relaxed">Neural engine flagged a <span className="font-bold text-slate-900 dark:text-n-1">15% surge</span> in unauthorized live streams from Southeast Asia. The top offending platforms are: <span className="font-semibold text-blue-600 dark:text-color-1">TelegramSG, IndieStream.io, ViralFeedTH</span>.</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[["Incidents", "1,284"], ["Countries", "6"], ["Est. Loss", "$42k"]].map(([k, v]) => (
                <div key={k} className="bg-slate-50 dark:bg-n-7 rounded-xl p-4 text-center border border-slate-200 dark:border-n-1/10">
                  <p className="text-2xl font-bold font-grotesk text-slate-900 dark:text-n-1">{v}</p>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-n-4 uppercase mt-1">{k}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setInvestigateModal(false); showToast("Investigation task created!"); }} className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white rounded-lg text-sm font-bold">Create Task</button>
              <button onClick={() => setInvestigateModal(false)} className="flex-1 py-3 bg-slate-100 dark:bg-n-7 hover:bg-slate-200 dark:hover:bg-n-6 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-n-1 tracking-wide">Detection Trends</h1>
          <p className="text-slate-500 dark:text-n-3 mt-2">Comprehensive view of intellectual property monitoring performance</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Timeframe toggle */}
          <div className="flex bg-white dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-lg p-1 text-xs font-bold text-slate-500 dark:text-n-4">
            {(["7D", "30D", "90D", "YTD"] as const).map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1.5 rounded transition-all ${timeframe === tf ? "bg-blue-50 text-blue-700 dark:bg-n-7 dark:text-color-1 shadow-sm" : "hover:text-slate-900 dark:hover:text-n-1"}`}>{tf}</button>
            ))}
          </div>
          <button onClick={handleRefresh} disabled={isRefreshing} className="p-2 bg-slate-100 dark:bg-n-7 hover:bg-slate-200 dark:hover:bg-n-6 text-slate-500 dark:text-n-3 rounded-lg border border-slate-200 dark:border-n-1/10 transition-colors disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
          <button onClick={handleExport} disabled={exportState !== "idle"} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all uppercase tracking-wider text-white dark:text-n-8 ${exportState === "done" ? "bg-emerald-600" : "bg-blue-700 hover:bg-blue-800 dark:bg-color-1 dark:hover:opacity-90"}`}>
            {exportState === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : exportState === "done" ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {exportState === "idle" ? "Export Report" : exportState === "loading" ? "Exporting..." : "Exported!"}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="TOTAL DETECTIONS" value={data.metrics.detections} subtext={`vs previous ${timeframe}`} trend="up" borderAccent="border-l-blue-600 dark:border-l-color-1" />
        <MetricCard title="CONFIRMED VIOLATIONS" value={data.metrics.violations} subtext="4.2% critical rate" trend="down" borderAccent="border-l-red-600 dark:border-l-color-3" />
        <MetricCard title="CONTENT FINGERPRINTS" value={data.metrics.fingerprints} subtext="Indexed globally" trend="neutral" borderAccent="border-l-slate-300 dark:border-l-n-5" />
        <MetricCard title="REVENUE RECOVERY" value={data.metrics.revenue} subtext="Direct estimation" trend="neutral" borderAccent="border-l-slate-300 dark:border-l-n-5" subtextIcon={<UploadCloud className="w-3 h-3 inline mr-1" />} />
      </div>

      {/* Chart + Platform Bars */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Trend Chart */}
        <div className="flex-[2] bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-sm tracking-wider text-slate-800 dark:text-n-1 uppercase">Detection Trends Over Time</h3>
              <p className="text-xs text-slate-500 dark:text-n-4 mt-1">Daily resolution across all active licenses</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-color-1"><span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-color-1"></span>Organic</span>
              <span className="flex items-center gap-1.5 text-red-600 dark:text-color-3"><span className="w-2 h-2 rounded-full bg-red-600 dark:bg-color-3"></span>Infringing</span>
            </div>
          </div>
        <div className="flex-1 flex items-end justify-between gap-1 sm:gap-3 h-52 mt-4">
            {data.chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                {(d.highlight || hoveredBar === i) && (
                  <div className="chart-tooltip absolute -top-10 bg-slate-800 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold shadow-lg z-10 whitespace-nowrap animate-in fade-in duration-150 border border-slate-700">
                    Organic: {d.org}% &nbsp;·&nbsp; Infringing: {d.inf}%
                    <div className="chart-tooltip absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-800 rotate-45 border-r border-b border-slate-700"></div>
                  </div>
                )}
                <div className="w-full sm:w-10 relative flex items-end h-full gap-0.5">
                  {/* Organic bar — soft blue fill */}
                  <div
                    className="flex-1 rounded-t-sm transition-all duration-700 ease-out"
                    style={{
                      height: barAnimated ? `${d.org}%` : "0%",
                      background: "linear-gradient(to top, #3b82f6, #93c5fd)",
                      opacity: 0.85,
                    }}
                  />
                  {/* Infringing bar — red/rose fill */}
                  <div
                    className="flex-1 rounded-t-sm transition-all duration-700 ease-out"
                    style={{
                      height: barAnimated ? `${d.inf}%` : "0%",
                      transitionDelay: `${i * 50}ms`,
                      background: d.highlight
                        ? "linear-gradient(to top, #dc2626, #f87171)"
                        : "linear-gradient(to top, #6366f1, #a5b4fc)",
                      boxShadow: d.highlight ? "0 0 8px rgba(220,38,38,0.4)" : "none",
                    }}
                  />
                </div>
                <span className="text-[9px] font-bold tracking-widest text-slate-500 dark:text-n-4 mt-2 uppercase">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Progress */}
        <div className="flex-1 bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 dark:text-n-1 mb-6">Detections per Platform</h3>
          <div className="flex flex-col gap-5 flex-1">
            {platformsData.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-bold text-slate-800 dark:text-n-1">{p.label}</span>
                  <span className="text-sm font-bold font-grotesk text-slate-900 dark:text-n-1">{p.val}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-n-7 rounded-sm overflow-hidden group cursor-pointer">
                  <div className="h-full bg-blue-700 dark:bg-color-1 rounded-sm transition-all duration-1000 ease-out group-hover:bg-blue-500" style={{ width: `${p.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-n-1/10 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-n-4">Aggregate Risk Level</span>
            <div className="flex gap-1 items-center">
              <div className="w-6 h-1.5 bg-blue-600 dark:bg-color-1 rounded-full"></div>
              <div className="w-6 h-1.5 bg-blue-600 dark:bg-color-1 rounded-full"></div>
              <div className="w-6 h-1.5 bg-slate-300 dark:bg-n-6 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Top Infringing Platforms */}
        <div className="flex-[2] bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold tracking-wider text-sm text-slate-800 dark:text-n-1 uppercase">Top Infringing Platforms</h3>
            <button onClick={() => { setViewAllPlatforms(p => !p); showToast("Viewing full platform list"); }} className="text-[10px] font-bold text-blue-600 dark:text-color-1 uppercase tracking-widest hover:underline">
              {viewAllPlatforms ? "Collapse" : "View All >"}</button>
          </div>
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-n-1/10">
            {infringingPlatforms.slice(0, viewAllPlatforms ? undefined : 3).map((p, i) => (
              <div key={i} className="flex items-center justify-between py-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-n-8/30 -mx-2 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 flex items-center justify-center font-bold text-slate-500 dark:text-n-4 text-sm group-hover:text-blue-600 dark:group-hover:text-color-1 transition-colors">{p.icon}</div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-n-1">{p.title}</p>
                    <p className="text-xs text-slate-500 dark:text-n-4 mt-0.5">{p.sub}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600 dark:text-color-3 text-lg font-grotesk">{p.incidents}</p>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">INCIDENTS</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Insights */}
        {!insightDismissed ? (
          <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-n-8 dark:to-[#0B0910] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-center text-center">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 dark:bg-color-1/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-color-1/20 text-blue-600 dark:text-color-1 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-blue-200 dark:border-color-1/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-n-1 mb-2">Automated Insights Active</h3>
              <p className="text-sm text-slate-600 dark:text-n-3 mb-6 px-4">
                Our neural engine has identified a <span className="font-bold text-slate-900 dark:text-n-1">15% uptick</span> in unauthorized live streams originating from Southeast Asia.
              </p>
              <div className="flex items-center gap-3 w-full px-4">
                <button onClick={() => { setInsightDismissed(true); showToast("Insight dismissed"); }} className="flex-1 bg-white dark:bg-n-7 border border-slate-200 dark:border-n-6 text-slate-700 dark:text-n-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-n-6 transition-colors">Dismiss</button>
                <button onClick={() => setInvestigateModal(true)} className="flex-1 bg-blue-700 dark:bg-color-1 text-white dark:text-n-8 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity">Investigate</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white dark:bg-[#0E0C15] border border-dashed border-slate-300 dark:border-n-1/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-n-7 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-n-4">Insight acknowledged</p>
            <button onClick={() => setInsightDismissed(false)} className="text-[11px] font-bold text-blue-600 dark:text-color-1 hover:underline uppercase tracking-widest">Show Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtext, trend, borderAccent, subtextIcon }: any) {
  return (
    <div className={`p-6 bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 border-l-4 ${borderAccent} rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-default`}>
      <p className="text-[10px] font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-3">{title}</p>
      <h2 className="text-3xl font-grotesk font-bold text-slate-900 dark:text-n-1 mb-2 tracking-tight">{value}</h2>
      <p className={`text-xs font-semibold flex items-center gap-1 ${trend === "up" ? "text-blue-600 dark:text-color-1" : trend === "down" ? "text-red-600 dark:text-color-3" : "text-slate-500 dark:text-n-4"}`}>
        {trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : trend === "down" ? <TrendingDown className="w-3.5 h-3.5" /> : subtextIcon}
        {subtext}
      </p>
    </div>
  );
}
