"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, Plus, Search, X, AlertTriangle, CheckCircle2, Loader2, SlidersHorizontal, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { service1, service2, service3, roadmap1 } from "@/public/assets/index";
import Image from "next/image";

const ITEMS_PER_PAGE = 3;

type SortKey = "title" | "severity" | "status" | "org";
type SortDir = "asc" | "desc";

const initialCases = [
  { id: "MR-92831-V", title: "Exclusive Premier Ep.04", severity: "Critical", sevOrder: 0, sevColor: "text-red-600 bg-red-100 dark:bg-color-3/20 dark:text-color-3", sevDot: "bg-red-600 dark:bg-color-3", org: "Global Media Group", platform: "VideoTube", status: "OPEN", statusColor: "text-red-700 bg-red-100 dark:bg-color-3/20 dark:text-color-3", actions: ["Review Evidence", "Escalate DMCA"], image: service1 },
  { id: "MR-92710-V", title: "Live Concert Stream", severity: "High", sevOrder: 1, sevColor: "text-blue-600 bg-blue-100 dark:bg-color-1/20 dark:text-color-1", sevDot: "bg-blue-600 dark:bg-color-1", org: "Universal Sounds", platform: "AudioHub", status: "REVIEWED", statusColor: "text-slate-600 bg-slate-200 dark:bg-n-6 dark:text-n-3", actions: ["Review Evidence", "Ignore"], image: service2 },
  { id: "MR-92552-V", title: "Gaming Finals Highlights", severity: "Medium", sevOrder: 2, sevColor: "text-slate-500 bg-slate-100 dark:bg-n-6 dark:text-n-3", sevDot: "bg-slate-500 dark:bg-n-4", org: "ESports Network", platform: "TwitchX", status: "RESOLVED", statusColor: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400", actions: ["Archive"], image: service3 },
  { id: "MR-92490-V", title: "Full Album Leak", severity: "Critical", sevOrder: 0, sevColor: "text-red-600 bg-red-100 dark:bg-color-3/20 dark:text-color-3", sevDot: "bg-red-600 dark:bg-color-3", org: "Atlantic Records", platform: "DriveBox", status: "OPEN", statusColor: "text-red-700 bg-red-100 dark:bg-color-3/20 dark:text-color-3", actions: ["Review Evidence", "Escalate DMCA"], image: roadmap1 },
  { id: "MR-92113-V", title: "Proprietary Data Reveal", severity: "High", sevOrder: 1, sevColor: "text-blue-600 bg-blue-100 dark:bg-color-1/20 dark:text-color-1", sevDot: "bg-blue-600 dark:bg-color-1", org: "DataMetrics Corp", platform: "InstaPost", status: "REVIEWED", statusColor: "text-slate-600 bg-slate-200 dark:bg-n-6 dark:text-n-3", actions: ["Review Evidence", "Ignore"], image: service2 },
  { id: "MR-91990-V", title: "Webinar Recording Theft", severity: "Medium", sevOrder: 2, sevColor: "text-slate-500 bg-slate-100 dark:bg-n-6 dark:text-n-3", sevDot: "bg-slate-500 dark:bg-n-4", org: "EduTech Corp", platform: "EduShare", status: "OPEN", statusColor: "text-red-700 bg-red-100 dark:bg-color-3/20 dark:text-color-3", actions: ["Review Evidence", "Ignore"], image: service3 },
];

const platformsData = [
  { name: "Instagram",  value: 65, count: "8,241",  color: "from-violet-500 to-blue-600" },
  { name: "TikTok",     value: 80, count: "10,182", color: "from-blue-500 to-blue-700",  isHighest: true },
  { name: "YouTube",   value: 35, count: "4,403",  color: "from-blue-400 to-blue-600" },
  { name: "Twitter/X", value: 50, count: "6,317",  color: "from-sky-500 to-blue-600" },
  { name: "Telegram",  value: 95, count: "12,094", color: "from-blue-600 to-indigo-700", isHighest: true },
  { name: "Web/Direct",value: 20, count: "2,518",  color: "from-slate-400 to-slate-600" },
];

export default function Violations() {
  const [cases, setCases] = useState(initialCases);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "REVIEWED" | "RESOLVED">("ALL");
  const [activeTab, setActiveTab] = useState<"Active Cases" | "Archive">("Active Cases");
  const [sortKey, setSortKey] = useState<SortKey>("sevOrder" as any);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "info" | "warn" } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<typeof initialCases[0] | null>(null);
  const [showManualFlag, setShowManualFlag] = useState(false);
  const [newFlagTitle, setNewFlagTitle] = useState("");
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [showTimeDD, setShowTimeDD] = useState(false);

  const showToast = (msg: string, type: "success" | "info" | "warn" = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let c = cases.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.org.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchTab = activeTab === "Archive" ? item.status === "RESOLVED" : item.status !== "RESOLVED";
      return matchSearch && matchStatus && matchTab;
    });
    c = [...c].sort((a: any, b: any) => {
      const av = a[sortKey] ?? a.sevOrder;
      const bv = b[sortKey] ?? b.sevOrder;
      if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return c;
  }, [cases, search, statusFilter, sortDir, sortKey, activeTab]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAction = (caseItem: typeof initialCases[0], action: string) => {
    if (action === "Review Evidence") { setSelectedCase(caseItem); return; }
    setProcessingId(caseItem.id + action);
    setTimeout(() => {
      if (action === "Escalate DMCA") {
        setCases(prev => prev.map(c => c.id === caseItem.id ? { ...c, status: "REVIEWED", statusColor: "text-slate-600 bg-slate-200 dark:bg-n-6 dark:text-n-3", actions: ["Review Evidence", "Ignore"] } : c));
        showToast(`DMCA filed for "${caseItem.title}"`, "success");
      } else if (action === "Ignore") {
        setCases(prev => prev.map(c => c.id === caseItem.id ? { ...c, status: "RESOLVED", statusColor: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400", actions: ["Archive"] } : c));
        showToast(`Case "${caseItem.title}" marked as resolved`, "info");
      } else if (action === "Archive") {
        setCases(prev => prev.filter(c => c.id !== caseItem.id));
        showToast(`Case archived`, "info");
      }
      setProcessingId(null);
    }, 1000);
  };

  const handleManualFlag = () => {
    if (!newFlagTitle.trim()) return;
    const newCase = {
      id: `MR-${Math.floor(Math.random() * 99999)}-V`,
      title: newFlagTitle,
      severity: "High",
      sevOrder: 1,
      sevColor: "text-blue-600 bg-blue-100 dark:bg-color-1/20 dark:text-color-1",
      sevDot: "bg-blue-600 dark:bg-color-1",
      org: "Manual Entry",
      platform: "Unknown",
      status: "OPEN",
      statusColor: "text-red-700 bg-red-100 dark:bg-color-3/20 dark:text-color-3",
      actions: ["Review Evidence", "Escalate DMCA"],
      image: service1,
    };
    setCases(prev => [newCase, ...prev]);
    setShowManualFlag(false);
    setNewFlagTitle("");
    showToast("New violation flagged successfully!", "success");
  };

  const SortIcon = ({ k }: { k: string }) => sortKey === k ?
    (sortDir === "asc" ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />) :
    <span className="w-3 h-3 inline-block ml-1 opacity-30">↕</span>;

  return (
    <div className="flex flex-col gap-6 p-2 md:p-6 lg:p-8 animate-in fade-in duration-500 relative">

      {/* Toast */}
      {toast && (
        <div className={`toast-notification fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 ${toast.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : toast.type === "warn" ? "bg-amber-500 border-amber-400 text-white" : "bg-slate-900 border-slate-700 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-slate-900 dark:text-white">{toast.msg}</span>
        </div>
      )}

      {/* Evidence Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedCase(null)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-n-1/10 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-n-1/10">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Evidence Review — {selectedCase.id}</p>
                <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">{selectedCase.title}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="aspect-video bg-slate-100 dark:bg-n-7 rounded-xl overflow-hidden relative border border-slate-200 dark:border-n-1/10">
                <Image src={selectedCase.image} alt="evidence" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className={`px-2 py-1 text-[9px] font-bold tracking-widest uppercase rounded ${selectedCase.statusColor}`}>{selectedCase.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[["Organization", selectedCase.org], ["Platform", selectedCase.platform], ["Case ID", selectedCase.id], ["Severity", selectedCase.severity]].map(([k, v]) => (
                  <div key={k}><p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-n-4 uppercase mb-1">{k}</p><p className="font-semibold text-slate-900 dark:text-n-1">{v}</p></div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { handleAction(selectedCase, "Escalate DMCA"); setSelectedCase(null); }} className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white rounded-lg text-sm font-bold transition-colors">Escalate DMCA</button>
                <button onClick={() => setSelectedCase(null)} className="flex-1 py-3 bg-slate-100 dark:bg-n-7 hover:bg-slate-200 dark:hover:bg-n-6 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Flag Modal */}
      {showManualFlag && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowManualFlag(false)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">Manual Flag</h3>
              <button onClick={() => setShowManualFlag(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <label className="block text-xs font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-2">Content Title</label>
            <input value={newFlagTitle} onChange={e => setNewFlagTitle(e.target.value)} placeholder="e.g. Unauthorized Movie Upload" className="w-full px-4 py-3 bg-slate-50 dark:bg-n-7 border border-slate-200 dark:border-n-6 rounded-xl text-slate-900 dark:text-n-1 text-sm focus:outline-none focus:ring-2 ring-blue-500 mb-6" />
            <div className="flex gap-3">
              <button onClick={handleManualFlag} className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white rounded-lg text-sm font-bold">Submit Flag</button>
              <button onClick={() => setShowManualFlag(false)} className="flex-1 py-3 bg-slate-100 dark:bg-n-7 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-n-1 tracking-wide">Violations Command Center</h1>
        <p className="text-slate-500 dark:text-n-3 mt-2 max-w-2xl">Real-time monitoring and enforcement of intellectual property rights across integrated digital platforms.</p>
      </div>

      {/* Top Metrics Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart with time filter */}
        <div className="flex-1 bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-n-1">Violations by Platform</h2>
              <p className="text-sm text-slate-500 dark:text-n-3 mt-1">Comparative distribution of infringements detected.</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowTimeDD(p => !p)} className="flex items-center gap-2 bg-slate-100 dark:bg-n-7 hover:bg-slate-200 dark:hover:bg-n-6 text-slate-700 dark:text-n-1 px-3 py-1.5 rounded-lg text-sm transition-colors border border-transparent dark:border-n-1/10">
                {timeRange} <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showTimeDD && (
                <div className="absolute right-0 top-10 bg-white dark:bg-n-7 border border-slate-200 dark:border-n-1/10 rounded-xl shadow-xl z-20 w-36 py-1 animate-in fade-in zoom-in-95 duration-150">
                  {["Last 7 Days", "Last 30 Days", "Last 90 Days"].map(t => (
                    <button key={t} onClick={() => { setTimeRange(t); setShowTimeDD(false); showToast(`Showing ${t}`, "info"); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-n-6 transition-colors ${timeRange === t ? "font-bold text-blue-600 dark:text-color-1" : "text-slate-700 dark:text-n-2"}`}>{t}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Y-axis + Chart Container */}
          <div className="flex gap-3 h-56 mt-2">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-right pb-6 shrink-0">
              {["100", "75", "50", "25", "0"].map(v => (
                <span key={v} className="text-[9px] font-bold text-slate-300 dark:text-n-6 leading-none">{v}</span>
              ))}
            </div>
            {/* Grid + Bars */}
            <div className="flex-1 flex flex-col">
              {/* Horizontal gridlines */}
              <div className="relative flex-1">
                {[0, 25, 50, 75, 100].map((pct) => (
                  <div key={pct} className="absolute left-0 right-0 border-t border-dashed border-slate-100 dark:border-n-7" style={{ bottom: `${pct}%` }}></div>
                ))}
                {/* Bars */}
                <div className="absolute inset-0 flex items-end gap-2 pb-0">
                  {platformsData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative">
                      {/* Value label on top */}
                      <div className="absolute text-center transition-all duration-300" style={{ bottom: `${item.value}%` }}>
                        <span className="relative -top-6 text-[10px] font-bold text-slate-500 dark:text-n-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-n-8 px-1.5 py-0.5 rounded shadow-sm border border-slate-100 dark:border-n-6">
                          {item.count}
                        </span>
                      </div>
                      {/* Bar with gradient */}
                      <div
                        className={`w-full rounded-t-lg bg-gradient-to-t ${item.color} transition-all duration-700 ease-out shadow-md group-hover:brightness-110 group-hover:shadow-lg group-hover:shadow-blue-500/20 relative overflow-hidden`}
                        style={{ height: `${item.value}%`, transitionDelay: `${idx * 60}ms` }}
                      >
                        {/* Shine overlay */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {/* Pulse glow for top bars */}
                        {item.value >= 80 && (
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 rounded-t-lg animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* X labels */}
              <div className="flex gap-2 pt-2">
                {platformsData.map((item, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-n-4 leading-tight block truncate px-0.5">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="lg:w-72 flex flex-col gap-4">
          {[
            { label: "Active Violations", val: cases.filter(c => c.status === "OPEN").length.toString(), color: "text-blue-700 dark:text-color-1" },
            { label: "Successful Takedowns", val: "89%", color: "text-amber-700 dark:text-color-3" },
            { label: "Awaiting Review", val: `${cases.filter(c => c.status === "REVIEWED").length}`, suffix: "cases", color: "text-amber-600 dark:text-amber-500" },
          ].map(({ label, val, color, suffix }) => (
            <div key={label} className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 dark:text-n-4 uppercase mb-2">{label}</span>
              <span className={`text-4xl font-bold font-grotesk tracking-tight ${color}`}>{val}<span className="text-xl">{suffix ? "" : ""}</span></span>
              {suffix && <span className="text-base text-slate-400 dark:text-n-4 ml-2 font-sans tracking-normal">{suffix}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Case Management Table */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-200 dark:border-n-1/10 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-n-1">Violations Case Management</h2>
            <p className="text-sm text-slate-500 dark:text-n-3 mt-1">Manage and enforce intellectual property rights across digital platforms.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search cases..." className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-6 rounded-lg text-sm text-slate-600 dark:text-n-2 focus:outline-none focus:ring-2 ring-blue-500 w-48" />
            </div>
            {/* Status filter */}
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }} className="px-3 py-2 bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-6 rounded-lg text-sm text-slate-600 dark:text-n-2 focus:outline-none focus:ring-2 ring-blue-500">
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            {/* Tab toggle */}
            <div className="flex bg-slate-100 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 p-1 rounded-lg">
              {(["Active Cases", "Archive"] as const).map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`px-4 py-1.5 text-sm font-semibold rounded transition-all ${activeTab === tab ? "bg-white dark:bg-n-6 text-blue-600 dark:text-color-1 shadow-sm" : "text-slate-500 dark:text-n-4 hover:text-slate-700 dark:hover:text-n-2"}`}>{tab}</button>
              ))}
            </div>
            <button onClick={() => setShowManualFlag(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white dark:text-n-8 dark:hover:opacity-90 rounded-lg text-sm font-bold shadow-sm transition-all">
              <Plus className="w-4 h-4" /> Manual Flag
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100 dark:bg-n-8/50 text-slate-500 dark:text-n-4 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200 dark:border-n-1/10">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-800 dark:hover:text-n-2" onClick={() => handleSort("title")}>Content Preview <SortIcon k="title" /></th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-800 dark:hover:text-n-2" onClick={() => handleSort("severity")}>Severity <SortIcon k="severity" /></th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-800 dark:hover:text-n-2" onClick={() => handleSort("org")}>Organization <SortIcon k="org" /></th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-800 dark:hover:text-n-2" onClick={() => handleSort("status")}>Status <SortIcon k="status" /></th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-n-1/10 text-slate-700 dark:text-n-1 bg-white dark:bg-[#0E0C15]">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-n-4">No cases found. Try adjusting your filters.</td></tr>
              ) : paginated.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-n-8/30 transition-colors cursor-pointer" onClick={() => setSelectedCase(c)}>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-n-8 rounded overflow-hidden relative border border-slate-200 dark:border-n-1/10 flex-shrink-0">
                        <Image src={c.image} alt="preview" fill className="object-cover opacity-80" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-n-1">{c.title}</div>
                        <div className="text-[10px] text-slate-400 dark:text-n-4 mt-0.5 tracking-wider">ID: {c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-n-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.sevDot}`}></span>{c.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-n-2">{c.org}</td>
                  <td className="px-6 py-4"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-n-3">{c.platform}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[9px] font-bold tracking-widest uppercase rounded border border-transparent ${c.statusColor}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex flex-col gap-1.5 w-36">
                      {c.actions.map((act, i) => {
                        const isLoading = processingId === c.id + act;
                        return (
                          <button
                            key={i}
                            disabled={!!processingId}
                            onClick={() => handleAction(c, act)}
                            className={`w-full py-1.5 text-xs font-semibold rounded border flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-60
                            ${ act === "Escalate DMCA"
                              ? "bg-blue-700 border-blue-700 text-white hover:bg-blue-800"
                              : act === "Review Evidence"
                              ? "bg-blue-50 border-blue-300 text-blue-700 font-bold hover:bg-blue-100 dark:bg-n-8 dark:border-color-1/30 dark:text-color-1"
                              : act === "Ignore"
                              ? "bg-slate-200 border-slate-300 text-slate-700 font-semibold hover:bg-slate-300 dark:bg-n-7 dark:border-n-6 dark:text-n-4"
                              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-n-8 dark:border-n-6 dark:text-n-3"
                            }`}
                          >
                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                            {act}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-n-1/10 flex items-center justify-between text-sm text-slate-500 dark:text-n-4 bg-slate-50 dark:bg-[#09080d]">
          <p>Showing <span className="font-semibold text-slate-900 dark:text-n-1">{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}</span>–<span className="font-semibold text-slate-900 dark:text-n-1">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-slate-900 dark:text-n-1">{filtered.length}</span> cases</p>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1 px-2 bg-slate-100 dark:bg-n-7 text-slate-400 dark:text-n-4 rounded disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-n-6 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded font-semibold transition-colors ${page === i + 1 ? "bg-blue-600 dark:bg-color-1 text-white dark:text-n-8" : "hover:bg-slate-100 dark:hover:bg-n-7 text-slate-600 dark:text-n-2"}`}>{i + 1}</button>
            ))}
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-n-7 rounded text-slate-700 dark:text-n-2 disabled:opacity-40 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
