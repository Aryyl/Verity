"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, List, Grid as GridIcon, X, Loader2, CheckCircle2, Download, FileText } from "lucide-react";
import { service1, service2, service3, roadmap1 as service4 } from "@/public/assets/index";

export default function AssetLibrary() {
  const [selectedAsset, setSelectedAsset] = useState<number | null>(1); // Default to the first asset
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done">("idle");
  const [reportState, setReportState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownload = () => {
    setDownloadState("loading");
    setTimeout(() => {
      setDownloadState("done");
      setTimeout(() => setDownloadState("idle"), 2500);
    }, 1500);
  };

  const handleGenerateReport = () => {
    setReportState("loading");
    setTimeout(() => {
      setReportState("done");
      setTimeout(() => setReportState("idle"), 2500);
    }, 2000);
  };

  const assets = [
    {
      id: 1,
      name: "cyberpunk_trailer_v4.mp4",
      size: "1.4 GB",
      reso: "4K UHD",
      owner: "Global Media Corp",
      date: "April 24, 2026",
      status: "Licensed",
      image: service1,
    },
    {
      id: 2,
      name: "bts_interview_studio.mov",
      size: "842 MB",
      reso: "1080p",
      owner: "Studio Seven",
      date: "March 30, 2026",
      status: "Pending",
      image: service2,
    },
    {
      id: 3,
      name: "encrypted_master_001.raw",
      size: "12.5 GB",
      reso: "RAW",
      owner: "Data Trust Int.",
      date: "March 15, 2026",
      status: "Restricted",
      image: service3,
    },
    {
      id: 4,
      name: "marketing_promo_fall.mp4",
      size: "422 MB",
      reso: "1080p",
      owner: "Global Media Corp",
      date: "March 19, 2026",
      status: "Licensed",
      image: service4,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] border border-slate-200 dark:border-n-1/10 rounded-2xl bg-white dark:bg-n-8 overflow-hidden animate-in fade-in duration-500 shadow-sm">
      
      {/* Main List Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Filters Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-slate-200 dark:border-n-1/10 gap-4">
          <div className="flex flex-wrap items-center gap-4">
             <FilterDropdown label="UPLOAD DATE" value="Last 30 Days" />
             <FilterDropdown label="OWNER" value="All Organizations" />
             <FilterDropdown label="STATUS" value="Licensed" />
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-n-7 p-1 rounded-lg">
             <button onClick={() => setViewMode("list")} className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-white dark:bg-n-6 text-blue-600 dark:text-color-1 shadow-sm" : "text-slate-500 dark:text-n-3 hover:text-slate-900 dark:hover:text-n-1"}`}><List className="w-4 h-4" /></button>
             <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-white dark:bg-n-6 text-blue-600 dark:text-color-1 shadow-sm" : "text-slate-500 dark:text-n-3 hover:text-slate-900 dark:hover:text-n-1"}`}><GridIcon className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Dynamic Display Area (List vs Grid) */}
        <div className="flex-1 overflow-auto">
          {viewMode === "list" ? (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-n-7/50 text-slate-500 dark:text-n-3 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-n-1/10 sticky top-0">
              <tr>
                <th className="px-6 py-4">Thumbnail</th>
                <th className="px-6 py-4">Asset Name</th>
                <th className="px-6 py-4">Organization Owner</th>
                <th className="px-6 py-4">Upload Date</th>
                <th className="px-6 py-4">License Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-n-1/10 text-slate-700 dark:text-n-1">
               {assets.map((asset) => (
                 <tr 
                   key={asset.id} 
                   onClick={() => setSelectedAsset(asset.id)}
                   className={`cursor-pointer transition-colors ${selectedAsset === asset.id ? 'bg-blue-50/50 dark:bg-n-7' : 'hover:bg-slate-50 dark:hover:bg-n-7/50'}`}
                 >
                   <td className="px-6 py-3">
                     {asset.image ? (
                        <div className="w-16 h-10 rounded overflow-hidden relative border border-slate-200 dark:border-n-1/10 bg-slate-100 dark:bg-n-9">
                          <Image src={asset.image} alt={asset.name} layout="fill" objectFit="cover" className="opacity-90 hover:opacity-100 transition-opacity" />
                        </div>
                     ) : (
                        <div className="w-16 h-10 rounded bg-slate-200 dark:bg-n-7"></div>
                     )}
                   </td>
                   <td className="px-6 py-3">
                     <div className="font-semibold text-slate-900 dark:text-n-1">{asset.name}</div>
                     <div className="text-xs text-slate-500 dark:text-n-3">{asset.size} • {asset.reso}</div>
                   </td>
                   <td className="px-6 py-3">{asset.owner}</td>
                   <td className="px-6 py-3">{asset.date}</td>
                   <td className="px-6 py-3">
                     <span className={`flex items-center gap-1.5 font-medium ${asset.status === 'Licensed' ? 'text-blue-600 dark:text-color-1' : asset.status === 'Restricted' ? 'text-red-600 dark:text-color-3' : 'text-slate-500 dark:text-n-3'}`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${asset.status === 'Licensed' ? 'bg-blue-600 dark:bg-color-1' : asset.status === 'Restricted' ? 'bg-red-600 dark:bg-color-3' : 'bg-slate-500 dark:bg-n-4'}`}></span>
                       {asset.status}
                     </span>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
          ) : (
             <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
               {assets.map((asset) => (
                 <div 
                   key={asset.id} 
                   onClick={() => setSelectedAsset(asset.id)}
                   className={`relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${selectedAsset === asset.id ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg' : 'border-slate-200 dark:border-n-1/10 hover:border-slate-300 dark:hover:border-n-1/20 hover:shadow-md bg-white dark:bg-n-8'}`}
                 >
                   <div className="w-full aspect-video bg-slate-100 dark:bg-n-9 relative border-b border-inherit">
                     {asset.image && <Image src={asset.image} alt={asset.name} layout="fill" objectFit="cover" className="transition-transform duration-700 hover:scale-105" />}
                     <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold backdrop-blur-md ${asset.status === 'Licensed' ? 'text-blue-700 bg-blue-100/90 dark:text-color-1 dark:bg-color-1/20' : asset.status === 'Restricted' ? 'text-red-700 bg-red-100/90 dark:text-red-400 dark:bg-red-900/40' : 'text-slate-600 bg-slate-100/90 dark:text-n-3 dark:bg-n-7/80'}`}>
                          {asset.status}
                        </span>
                     </div>
                   </div>
                   <div className="p-4">
                     <div className="font-bold text-sm text-slate-900 dark:text-n-1 truncate mb-1">{asset.name}</div>
                     <div className="flex items-center justify-between text-xs text-slate-500 dark:text-n-3">
                       <span className="font-mono">{asset.size} / {asset.reso}</span>
                       <span>{asset.date}</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-n-1/10 flex items-center justify-between text-sm text-slate-500 dark:text-n-3 bg-slate-50 dark:bg-n-8">
          <p>Showing <span className="font-semibold text-slate-900 dark:text-n-1">1-4</span> of <span className="font-semibold text-slate-900 dark:text-n-1">2,482</span> assets</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-slate-400 hover:text-slate-900 dark:hover:text-n-1">&lt;</button>
            <button className="px-3 py-1.5 bg-blue-700 dark:bg-color-1 text-white dark:text-n-8 rounded font-medium">1</button>
            <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-n-3 dark:hover:bg-n-7 rounded">2</button>
            <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-n-3 dark:hover:bg-n-7 rounded">3</button>
            <span className="px-2">...</span>
            <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-n-3 dark:hover:bg-n-7 rounded">62</button>
            <button className="px-3 py-1 text-slate-400 hover:text-slate-900 dark:hover:text-n-1">&gt;</button>
          </div>
        </div>

      </div>

      {/* Asset Details Sidebar */}
      {selectedAsset && (() => {
        const activeItem = assets.find(a => a.id === selectedAsset);
        if (!activeItem) return null;
        
        return (
          <div className="w-full lg:w-[360px] border-l border-slate-200 dark:border-n-1/10 flex flex-col bg-slate-50 dark:bg-n-8 animate-in slide-in-from-right-8 duration-300 z-10">
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-n-1/10">
              <h2 className="font-bold text-slate-900 dark:text-n-1 tracking-wide">Asset Details</h2>
              <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-slate-600 dark:text-n-3 dark:hover:text-n-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>
          
          <div className="p-6 overflow-y-auto flex-1">
             {/* Thumbnail Large */}
             <div className="w-full aspect-video bg-slate-200 dark:bg-n-9 rounded-lg mb-6 overflow-hidden relative border border-slate-200 dark:border-n-1/10 flex flex-col items-center justify-center group shadow-inner">
                 {activeItem.image ? (
                   <Image src={activeItem.image} alt={activeItem.name} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-700" />
                 ) : (
                   <div className="z-10 text-n-3 text-xs opacity-50 tracking-widest font-mono">PREVIEW UNAVAILABLE</div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>

             {/* Fingerprint ID */}
             <div className="mb-6">
                <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-n-3 uppercase mb-2">Fingerprint ID</p>
                <div className="p-3 bg-slate-100 dark:bg-n-7 rounded-lg text-xs font-mono text-slate-600 dark:text-n-2 border border-slate-200 dark:border-transparent select-all">
                  8f2a6e9c3b1a2f5d8e7a4c9b0f1e2d3a
                </div>
             </div>

             {/* Metadata Grid */}
             <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-n-3 uppercase mb-1">File Type</p>
                  <p className="font-semibold text-slate-900 dark:text-n-1 text-sm">{activeItem.name.split('.').pop()?.toUpperCase()} Document</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-n-3 uppercase mb-1">Owner</p>
                  <p className="font-semibold text-slate-900 dark:text-n-1 text-sm">{activeItem.owner}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-n-3 uppercase mb-1">Resolution</p>
                  <p className="font-semibold text-slate-900 dark:text-n-1 text-sm">{activeItem.reso}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-n-3 uppercase mb-1">Upload Date</p>
                  <p className="font-semibold text-slate-900 dark:text-n-1 text-sm">{activeItem.date}</p>
                </div>
             </div>

             {/* Usage Rights */}
             <div className="mb-8">
                <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-n-3 uppercase mb-3">Usage Rights</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-color-1/10 dark:text-color-1 text-[11px] font-bold rounded">Social Media</span>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-color-1/10 dark:text-color-1 text-[11px] font-bold rounded">Broadcasting</span>
                  <span className="px-3 py-1.5 bg-slate-200 text-slate-600 dark:bg-n-7 dark:text-n-3 text-[11px] font-bold rounded">No Commercial</span>
                </div>
             </div>

             {/* Actions */}
             <div className="flex flex-col gap-3">
               <button 
                 onClick={handleDownload}
                 disabled={downloadState !== "idle"}
                 className={`w-full py-3 hover:opacity-90 dark:text-n-8 text-white rounded-lg text-sm font-bold transition-all shadow-sm flex justify-center items-center gap-2 ${downloadState === "done" ? "bg-emerald-600 dark:bg-emerald-500" : "bg-blue-600 dark:bg-color-1"}`}
               >
                 {downloadState === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                 {downloadState === "done" && <CheckCircle2 className="w-4 h-4" />}
                 {downloadState === "idle" && <Download className="w-4 h-4" />}
                 {downloadState === "idle" ? "Download Master File" : downloadState === "loading" ? "Downloading..." : "Downloaded!"}
               </button>
               <button 
                 onClick={handleGenerateReport}
                 disabled={reportState !== "idle"}
                 className={`w-full py-3 hover:opacity-90 rounded-lg text-sm font-bold transition-all flex justify-center items-center gap-2 ${reportState === "done" ? "bg-emerald-600 dark:bg-emerald-500 text-white" : "bg-slate-200 dark:bg-n-7 text-slate-700 dark:text-n-1"}`}
               >
                 {reportState === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                 {reportState === "done" && <CheckCircle2 className="w-4 h-4" />}
                 {reportState === "idle" && <FileText className="w-4 h-4" />}
                 {reportState === "idle" ? "Generate Rights Report" : reportState === "loading" ? "Generating..." : "Report Generated!"}
               </button>
             </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

function FilterDropdown({ label, value }: { label: string; value: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="flex flex-col relative">
       <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-n-3 uppercase mb-1">{label}</span>
       <button 
         onClick={() => setIsOpen(!isOpen)}
         onBlur={() => setTimeout(() => setIsOpen(false), 200)}
         className={`flex items-center justify-between border transition-colors bg-white dark:bg-n-8 px-3 py-2 rounded-lg text-sm w-44 text-slate-900 dark:text-n-1 ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200 dark:border-n-1/10 hover:border-slate-300 dark:hover:border-n-1/20 hover:bg-slate-50 dark:hover:bg-n-7'}`}
       >
         <span className="truncate pr-2">{value}</span>
         <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen && 'rotate-180'}`} />
       </button>
       {/* Mock Dropdown Output */}
       {isOpen && (
         <div className="absolute top-[110%] left-0 w-full min-w-[200px] z-50 bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
           <div className="p-2 space-y-1">
             {['All Organizations', 'Global Media Corp', 'Studio Seven', 'Data Trust Int.'].map(org => (
               <button key={org} className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-n-1 hover:bg-slate-100 dark:hover:bg-n-7 font-medium transition-colors">
                 {org}
               </button>
             ))}
           </div>
         </div>
       )}
    </div>
  );
}
