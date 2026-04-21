"use client";

import React, { useState, useEffect } from "react";
import { Download, RefreshCw, FileText, Image as ImageIcon, Video, FileAudio, Eye, Flag, Check, Loader2, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardOverview() {
  const [activeTimeframe, setActiveTimeframe] = useState("24H");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [flaggedRows, setFlaggedRows] = useState<number[]>([]);
  const [viewingAsset, setViewingAsset] = useState<any>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const chartDatasets: any = {
    "24H": [
      { scans: 120, threats: 5 }, { scans: 180, threats: 8 }, { scans: 210, threats: 12 }, 
      { scans: 450, threats: 62 }, { scans: 310, threats: 24 }, { scans: 240, threats: 8 }, 
      { scans: 190, threats: 10 }, { scans: 140, threats: 42 }, { scans: 170, threats: 6 }
    ],
    "7D": [
      { scans: 840, threats: 45 }, { scans: 1100, threats: 80 }, { scans: 950, threats: 32 }, 
      { scans: 1250, threats: 95 }, { scans: 1400, threats: 120 }, { scans: 1150, threats: 60 }, 
      { scans: 900, threats: 40 }, { scans: 1050, threats: 75 }, { scans: 1300, threats: 110 }
    ],
    "30D": [
      { scans: 4200, threats: 210 }, { scans: 4800, threats: 350 }, { scans: 5100, threats: 280 }, 
      { scans: 6000, threats: 420 }, { scans: 5800, threats: 510 }, { scans: 5200, threats: 320 }, 
      { scans: 4900, threats: 240 }, { scans: 5300, threats: 450 }, { scans: 5900, threats: 380 }
    ],
    "ALL": [
      { scans: 15200, threats: 840 }, { scans: 18400, threats: 1200 }, { scans: 21000, threats: 950 }, 
      { scans: 24500, threats: 1800 }, { scans: 22800, threats: 2100 }, { scans: 19500, threats: 1400 }, 
      { scans: 17800, threats: 980 }, { scans: 19800, threats: 1250 }, { scans: 23000, threats: 1650 }
    ]
  };

  const currentData = chartDatasets[activeTimeframe] || chartDatasets["24H"];
  const maxScans = Math.max(...currentData.map((d: any) => d.scans));

  const mockRows = [
    { id: 1, name: "Trailer_v14_Final.mp4", icon: Video, type: "VIDEO", status: "Authentic", score: "99.8%", source: "Internal Storage", time: "2m ago", isReview: false },
    { id: 2, name: "Brand_Logo_Variant_C.png", icon: ImageIcon, type: "IMAGE", status: "Violated", score: "94.2%", source: "Public Web Crawler", time: "14m ago", isReview: true },
    { id: 3, name: "Interview_Podcast_Ep42.mp3", icon: FileAudio, type: "AUDIO", status: "Suspicious", score: "68.5%", source: "Social Monitor", time: "22m ago", isReview: false },
    { id: 4, name: "Main_Event_Wrapup.mov", icon: Video, type: "VIDEO", status: "Authentic", score: "99.1%", source: "Internal Storage", time: "1h ago", isReview: false },
  ];

  const handleSelectAll = () => {
    if (selectedRows.length === mockRows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockRows.map(r => r.id));
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleExport = () => {
    alert(`Exporting ${selectedRows.length > 0 ? selectedRows.length : 'all'} rows to CSV...`);
  };

  const toggleFlag = (id: number) => {
    if (flaggedRows.includes(id)) {
      setFlaggedRows(flaggedRows.filter(r => r !== id));
    } else {
      setFlaggedRows([...flaggedRows, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="TOTAL ASSETS" value={activeTimeframe === "24H" ? "12,842" : "45,910"} trend="+4.2%" trendColor="text-blue-500" />
        <StatCard title="ACTIVE VIOLATIONS" value={activeTimeframe === "24H" ? "148" : "892"} trend="-12%" trendColor="text-slate-500" valueColor="text-red-500" />
        <StatCard title="PENDING REVIEW" value={activeTimeframe === "24H" ? "24" : "156"} trend="New +3" trendColor="text-green-500" />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detection Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-n-1 uppercase">Detection Trends ({activeTimeframe})</h3>
            
            <div className="flex justify-between items-center gap-6">
               <div className="flex items-center gap-4 text-xs">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-color-1"></div><span className="text-slate-500 dark:text-n-3">Scans</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-600 dark:bg-color-3"></div><span className="text-slate-500 dark:text-n-3">Threats</span></div>
               </div>
               
               {/* Interactive Timeframe Toggle */}
               <div className="flex bg-slate-100 dark:bg-n-8 p-1 rounded-lg">
                  {['24H', '7D', '30D', 'ALL'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setActiveTimeframe(t)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTimeframe === t ? 'bg-white dark:bg-n-6 text-blue-700 dark:text-color-1 shadow-sm' : 'text-slate-500 dark:text-n-4 hover:text-slate-700 dark:hover:text-n-2'}`}
                    >
                      {t}
                    </button>
                  ))}
               </div>
            </div>
          </div>
          {/* Animated Bar Chart with Tooltips */}
          <div className="relative h-48 flex items-end justify-between gap-2 px-2 group/chart">
            {currentData.map((data: any, i: number) => {
              const height = (data.scans / maxScans) * 100;

              return (
                <div 
                  key={i} 
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className={cn(
                    "relative w-full max-w-[40px] rounded-t-sm transition-all duration-700 ease-in-out cursor-pointer",
                    i === 3 ? "bg-blue-600 dark:bg-color-1" : i === 7 ? "bg-red-500 dark:bg-color-3" : "bg-slate-300 dark:bg-indigo-900/70 hover:bg-slate-400 dark:hover:bg-indigo-800"
                  )} 
                  style={{ height: `${height}%` }}
                >
                   {/* Interactive Tooltip */}
                   {hoveredBar === i && (
                     <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 pointer-events-none">
                        <div className="bg-slate-900 dark:bg-n-8 text-white px-3 py-2 rounded-lg shadow-2xl border border-white/10 whitespace-nowrap">
                           <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scans: <span className="text-white">{data.scans.toLocaleString()}</span></span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Threats: <span className="text-white">{data.threats.toLocaleString()}</span></span>
                           </div>
                           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-n-8 rotate-45 border-r border-b border-white/10"></div>
                        </div>
                     </div>
                   )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-slate-400 dark:text-n-4 mt-4 font-mono">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
             <h3 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-n-1 uppercase mb-8">Status Distribution</h3>
             <div className="space-y-6">
                <ProgressBar label="AUTHENTIC" count="8,420" percentage="65.5%" color="bg-blue-600 dark:bg-color-1" width="65%" />
                <ProgressBar label="SUSPICIOUS" count="3,142" percentage="24.4%" color="bg-amber-500 dark:bg-amber-400" width="24%" />
                <ProgressBar label="VIOLATED" count="1,280" percentage="10.1%" color="bg-red-600 dark:bg-color-3" width="10%" />
             </div>
          </div>
          <div className="mt-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-bold text-center rounded-lg py-3 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 delay-300 duration-1000 fill-mode-both">
            <Check className="w-4 h-4 animate-bounce" /> System integrity at 98.2%
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl shadow-sm overflow-hidden relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/40 dark:bg-black/20 backdrop-blur-[1px] z-20 flex items-center justify-center animate-in fade-in duration-200">
             <div className="bg-white dark:bg-n-8 p-4 rounded-xl shadow-xl flex items-center gap-3 border border-slate-100 dark:border-n-1/10">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm font-bold text-slate-800 dark:text-n-1">Refreshing stream...</span>
             </div>
          </div>
        )}

        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-n-1/10">
          <div className="flex items-center gap-4">
             <h3 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-n-1 uppercase">Recent Detection Activity</h3>
             {selectedRows.length > 0 && (
                <span className="px-2 py-1 bg-blue-50 dark:bg-color-1/10 text-blue-700 dark:text-color-1 text-[10px] uppercase tracking-widest font-bold rounded animate-in zoom-in-90 duration-200">
                  {selectedRows.length} Selected
                </span>
             )}
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-n-1/10 rounded-md text-sm font-bold text-slate-700 dark:text-n-1 hover:bg-slate-50 dark:hover:bg-n-8 transition-colors active:scale-95">
               <Download className="w-4 h-4" /> Export CSV
             </button>
             <button 
               onClick={handleRefresh}
               disabled={isRefreshing}
               className="flex items-center gap-2 px-4 py-2 bg-blue-700 dark:bg-color-1 text-white dark:text-n-8 rounded-md text-sm font-bold hover:bg-blue-800 dark:hover:opacity-90 transition-all shadow-sm active:scale-95 disabled:opacity-50"
             >
               <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} /> Refresh Feed
             </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-n-8 text-slate-500 dark:text-n-4 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200 dark:border-n-1/10">
              <tr>
                <th className="px-6 py-4 w-12 cursor-pointer" onClick={handleSelectAll}>
                   <Checkbox checked={selectedRows.length === mockRows.length} indeterminate={selectedRows.length > 0 && selectedRows.length < mockRows.length} />
                </th>
                <th className="px-6 py-4">Media Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Conf. Score</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Detected Time</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-n-1/10 text-slate-700 dark:text-n-1">
               {mockRows.map(row => (
                 <TableRow 
                   key={row.id}
                   data={row}
                   selected={selectedRows.includes(row.id)}
                   isFlagged={flaggedRows.includes(row.id)}
                   onSelect={() => handleSelectRow(row.id)}
                   onFlag={() => toggleFlag(row.id)}
                   onView={() => setViewingAsset(row)}
                 />
               ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-n-1/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-[#0E0C15]">
          <p className="uppercase tracking-widest text-[10px] font-bold text-slate-500 dark:text-n-4">Showing 4 of 12,842 total assets</p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-n-7 disabled:opacity-30"
              disabled={currentPage === 1}
            >
              {'<'}</button>
            {[1, 2, 3].map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-all",
                  currentPage === page 
                    ? "bg-blue-600 dark:bg-color-1 text-white dark:text-n-8 shadow-sm" 
                    : "text-slate-600 dark:text-n-3 hover:bg-slate-100 dark:hover:bg-n-7"
                )}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-600 dark:text-n-3 hover:bg-slate-100 dark:hover:bg-n-7 disabled:opacity-30"
              disabled={currentPage === 3}
            >
              {'>'}</button>
          </div>
        </div>
      </div>

      {/* Mock Asset Modal Overlay */}
      {viewingAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-n-8 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 border border-slate-100 dark:border-n-1/10">
              <div className="p-6 border-b border-slate-100 dark:border-n-1/10 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-color-1/10 text-blue-600 dark:text-color-1 rounded-lg">
                       <FileText className="w-5 h-5" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900 dark:text-n-1">{viewingAsset.name}</h4>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-4">Asset Details & Forensics</p>
                    </div>
                 </div>
                 <button onClick={() => setViewingAsset(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-n-7 rounded-full text-slate-400 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-8 grid grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-n-4 mb-1">Asset Integrity</p>
                       <p className={cn("text-sm font-bold text-slate-900 dark:text-n-1", viewingAsset.status === "Authentic" ? "text-emerald-600" : "text-red-600")}>{viewingAsset.status}</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-n-4 mb-1">Source Channel</p>
                       <p className="text-sm font-bold text-slate-900 dark:text-n-1">{viewingAsset.source}</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-n-4 mb-1">Timestamp</p>
                       <p className="text-sm font-bold text-slate-900 dark:text-n-1">Oct 24, 2023 · 14:22:01</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-n-4 mb-1">AI Match Confidence</p>
                       <p className="text-sm font-bold text-slate-900 dark:text-n-1">{viewingAsset.score}</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-n-4 mb-1">Fingerprint Hash</p>
                       <p className="text-sm font-bold text-slate-900 dark:text-n-1 font-mono">SHA-256: 4a8e2b...</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-n-4 mb-1">Review Status</p>
                       <p className="text-sm font-bold text-slate-900 dark:text-n-1">{viewingAsset.isReview ? "Pending Manual Check" : "Automated Verified"}</p>
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-n-7/30 flex justify-end gap-3">
                 <button onClick={() => setViewingAsset(null)} className="px-6 py-2 text-sm font-bold text-slate-600 dark:text-n-3">Close</button>
                 <button onClick={() => {alert("Report submitted."); setViewingAsset(null)}} className="px-6 py-2 bg-red-600 dark:bg-color-3 text-white text-sm font-bold rounded-lg shadow-sm active:scale-95 transition-all">Report Infringement</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

// ---------------- Helper Components ----------------

function StatCard({ title, value, trend, trendColor, valueColor = "text-slate-900 dark:text-n-1" }: any) {
  return (
    <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 p-6 rounded-2xl shadow-sm flex flex-col justify-center transition-all duration-300">
      <h3 className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-n-4 uppercase mb-4">{title}</h3>
      <div className="flex items-baseline gap-3">
        <span className={`text-4xl font-bold font-grotesk tracking-tight ${valueColor}`}>{value}</span>
        <span className={`text-xs font-bold ${trendColor}`}>{trend}</span>
      </div>
    </div>
  );
}

function ProgressBar({ label, count, percentage, color, width }: any) {
  const [activeWidth, setActiveWidth] = useState("0%");

  useEffect(() => {
    const timer = setTimeout(() => setActiveWidth(width), 100);
    return () => clearTimeout(timer);
  }, [width]);

  return (
    <div className="group cursor-default">
      <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-700 dark:text-n-1 mb-2 uppercase group-hover:text-blue-600 dark:group-hover:text-color-1 transition-colors">
        <span>{label}</span>
        <span className="text-slate-500 dark:text-n-4">{count} <span className="font-sans font-normal ml-1">({percentage})</span></span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-n-7 h-1.5 rounded-full overflow-hidden shadow-inner">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)} 
          style={{ width: activeWidth }}
        ></div>
      </div>
    </div>
  );
}

function Checkbox({ checked, indeterminate }: { checked: boolean, indeterminate?: boolean }) {
  return (
    <div className={cn(
      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
      (checked || indeterminate) ? 'bg-blue-600 border-blue-600 dark:bg-color-1 dark:border-color-1' : 'bg-white dark:bg-n-8 border-slate-300 dark:border-n-6'
    )}>
       {checked && <svg className="w-3 h-3 text-white dark:text-n-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
       {!checked && indeterminate && <div className="w-2 h-0.5 bg-white dark:bg-n-8 rounded-full" />}
    </div>
  );
}

function TableRow({ data, selected, isFlagged, onSelect, onFlag, onView }: any) {
  const { id, name, icon: Icon, type, status, score, source, time, isReview } = data;
  
  const getStatusColor = (s: string) => {
    if (s === "Authentic") return "text-emerald-700 dark:text-emerald-400";
    if (s === "Violated") return "text-red-700 dark:text-color-3";
    return "text-amber-600 dark:text-amber-400";
  }
  
  const getStatusDot = (s: string) => {
    if (s === "Authentic") return "bg-emerald-500";
    if (s === "Violated") return "bg-red-600 dark:bg-color-3";
    return "bg-amber-500";
  }

  return (
    <tr className={cn(
      "transition-colors group",
      selected ? 'bg-blue-50/50 dark:bg-color-1/5' : 'hover:bg-slate-50 dark:hover:bg-n-8/30'
    )}>
      <td className="px-6 py-4 cursor-pointer" onClick={onSelect}>
         <Checkbox checked={selected} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
           <div className={cn(
             "p-2 rounded-md transition-transform group-hover:scale-110 duration-200",
             type === "VIDEO" ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' : 
             type === "IMAGE" ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 
             'bg-blue-50 text-blue-600 dark:bg-color-1/10 dark:text-color-1'
           )}>
             <Icon className="h-4 w-4" />
           </div>
           <span className="font-bold text-slate-900 dark:text-n-1 text-[13px]">{name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 dark:text-n-4 uppercase">{type}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <div className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(status))}></div>
          <span className={cn("text-[10px] font-bold tracking-widest uppercase", getStatusColor(status))}>{status}</span>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-slate-900 dark:text-n-1">{score}</td>
      <td className="px-6 py-4 text-slate-500 dark:text-n-4 text-[11px] leading-relaxed font-semibold max-w-[120px] truncate">
        {source}
      </td>
      <td className="px-6 py-4 text-slate-500 dark:text-n-4 text-xs font-semibold">{time}</td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
           {isReview ? (
             <button 
               onClick={onView}
               className="px-3 py-1.5 bg-red-50 text-red-700 dark:bg-color-3/10 dark:text-color-3 hover:bg-red-100 dark:hover:bg-color-3/20 text-[10px] font-bold uppercase tracking-widest rounded transition-colors border border-red-200 dark:border-color-3/20 active:scale-95 shadow-sm"
             >
               Review
             </button>
           ) : (
             <>
               <button onClick={onView} className="p-1.5 hover:bg-slate-200 dark:hover:bg-n-7 rounded text-slate-400 dark:text-n-5 hover:text-slate-900 dark:hover:text-n-1 transition-all">
                 <Eye className="h-4 w-4" />
               </button>
               <button 
                 onClick={onFlag}
                 className={cn(
                   "p-1.5 rounded transition-all",
                   isFlagged 
                     ? "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 shadow-inner" 
                     : "hover:bg-slate-200 dark:hover:bg-n-7 text-slate-400 dark:text-n-5 hover:text-slate-900 dark:hover:text-n-1"
                 )}
               >
                 <Flag className={cn("h-4 w-4", isFlagged && "fill-current")} />
               </button>
             </>
           )}
        </div>
      </td>
    </tr>
  );
}
