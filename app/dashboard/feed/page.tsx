"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Zap, X, ShieldAlert, BadgeCheck, FileWarning, Sparkles, Server, PlayCircle, Globe, CheckCircle2, Loader2 } from "lucide-react";
import { service1, service2, service3 } from "@/public/assets/index";

const initialFeedTokens = [
  {
    id: "DET-88290",
    filename: "manifest_delta_092.mp4",
    platform: "Twitter/X",
    cid: "882X-PQ",
    platformIcon: Globe,
    status: "SUSPICIOUS",
    statusColor: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900",
    reason: "Deepfake Gen 4",
    confidence: "94.2%",
    confColor: "text-rose-600 dark:text-rose-400",
    time: "12:44:02 PM",
    image: null,
    isHighPriority: false
  },
  {
    id: "DET-88289",
    filename: "satellite_stream_B_4k.raw",
    platform: "Internal API",
    cid: "119K-ZZ",
    platformIcon: Server,
    status: "AUTHENTIC",
    statusColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
    reason: "Validated Source",
    confidence: "99.8%",
    confColor: "text-blue-600 dark:text-blue-400",
    time: "12:43:55 PM",
    image: "/assets/satellite.png",
    isHighPriority: false
  },
  {
    id: "DET-88291",
    filename: "cyberpunk_trailer_asset.mov",
    platform: "YouTube Ingest",
    cid: "554A-FF",
    platformIcon: PlayCircle,
    status: "FAKE",
    statusColor: "text-red-700 dark:text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
    reason: "Copy Mis-Match",
    confidence: "100%",
    confColor: "text-red-700 dark:text-red-500",
    time: "12:42:10 PM",
    image: "/assets/cyberpunk.png",
    isHighPriority: true
  }
];

export default function DetectionFeed() {
  const [selectedDetection, setSelectedDetection] = useState<string>("cyberpunk_trailer_asset.mov");
  const [feedItems, setFeedItems] = useState(initialFeedTokens);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveScanCount, setLiveScanCount] = useState(4281);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScanCount(prev => prev + Math.floor(Math.random() * 5));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (actionName: string) => {
    setIsProcessing(actionName);
    setTimeout(() => {
      setFeedItems(prev => prev.filter(item => item.filename !== selectedDetection));
      setSelectedDetection("");
      setIsProcessing(null);
      setToastMessage(`Item resolved automatically: ${actionName}`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] border border-slate-200 dark:border-n-1/10 rounded-2xl bg-slate-50 dark:bg-[#09080d] overflow-hidden animate-in fade-in duration-500 shadow-sm gap-px">
      
      {/* Left Main Feed */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-n-8 p-6">
        
        {/* Feed Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-n-1 tracking-wide">Live Detection Feed</h1>
            <p className="text-sm text-slate-500 dark:text-n-3 mt-1">Real-time Forensic Analysis <span className="text-slate-300 dark:text-n-5 mx-2">|</span> Pipeline</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-n-7 rounded text-xs font-semibold text-slate-600 dark:text-n-3">
               <Clock className="w-3.5 h-3.5" /> Last 24h
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-color-1/10 rounded text-xs font-semibold text-blue-600 dark:text-color-1">
               <Zap className="w-3.5 h-3.5" /> 14 New
             </div>
          </div>
        </div>

        {/* Feed Cards list */}
        <div className="flex flex-col gap-4 max-w-4xl">
          {feedItems.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedDetection(item.filename)}
              className={`relative cursor-pointer transition-all duration-300 rounded-xl border p-4 flex flex-col sm:flex-row gap-5 ${selectedDetection === item.filename ? 'border-red-500 shadow-md bg-white dark:bg-n-8' : 'border-slate-200 dark:border-n-1/10 bg-white/50 dark:bg-n-8/50 hover:bg-white dark:hover:bg-n-8 hover:shadow'}`}
            >
               {/* Left accent border if selected */}
               {selectedDetection === item.filename && (
                 <div className="absolute left-[-1px] top-4 bottom-4 w-1 bg-red-600 dark:bg-color-3 rounded-r"></div>
               )}

               {/* Thumbnail */}
               <div className="w-full sm:w-48 aspect-video bg-slate-100 dark:bg-n-7 rounded-lg overflow-hidden border border-slate-200 dark:border-n-1/10 flex-shrink-0 relative group">
                  {item.image ? (
                     <Image src={item.image} alt="Thumbnail" layout="fill" objectFit="cover" className="opacity-90 group-hover:opacity-100 transition-opacity" />
                  ) : (
                     <div className="w-full h-full bg-n-8 opacity-20"></div>
                  )}
               </div>

               {/* Content */}
               <div className="flex-1 flex flex-col justify-between">
                 <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-n-1 text-lg mb-1">{item.filename}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-n-3">
                        <span className="flex items-center gap-1"><item.platformIcon className="w-3.5 h-3.5" /> {item.platform}</span>
                        <span>CID: {item.cid}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-n-4">{item.time}</span>
                 </div>

                 <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center gap-2">
                       <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded border ${item.statusColor}`}>
                         {item.status}
                       </span>
                       <span className="px-2 py-1 bg-slate-100 dark:bg-n-7 text-slate-600 dark:text-n-3 text-[10px] rounded font-medium">
                         {item.reason}
                       </span>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-3 mb-1">Confidence</p>
                       <p className={`text-xl font-bold font-grotesk ${item.confColor}`}>{item.confidence}</p>
                    </div>
                 </div>
               </div>
            </div>
          ))}

          {/* Loader Element */}
          <div className="mt-4 bg-slate-50 dark:bg-n-7/50 border border-slate-200 dark:border-n-1/10 rounded-xl p-8 flex flex-col items-center justify-center text-center">
             <RefreshIcon className="w-8 h-8 text-slate-400 dark:text-n-4 mb-3 animate-spin duration-[3000ms]" />
             <p className="text-sm font-semibold text-slate-700 dark:text-n-1">Monitoring <span className="text-blue-600 dark:text-color-1 tabular-nums">{liveScanCount.toLocaleString()}</span> sources in real-time...</p>
             <p className="text-xs text-slate-500 dark:text-n-3 mt-1">Average detection latency: 1.2s</p>
          </div>
        </div>

      </div>

      {/* Right Investigation Sidebar */}
      {selectedDetection && (() => {
        const activeItem = feedItems.find(t => t.filename === selectedDetection);
        if (!activeItem) return null;

        return (
          <div className="w-full lg:w-[420px] bg-white dark:bg-n-8 flex flex-col overflow-y-auto relative animate-in slide-in-from-right-8 duration-300">
            
            {/* Interactive Toast Notification */}
            {toastMessage && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 fade-out slide-out-to-top-4 duration-300">
                 <div className="bg-slate-900 dark:bg-n-1 text-white dark:text-n-8 px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {toastMessage}
                 </div>
              </div>
            )}

            <div className={`p-5 border-b border-n-1/10 flex items-start justify-between sticky top-0 backdrop-blur-md z-10 ${activeItem.isHighPriority ? 'bg-red-50/90 dark:bg-rose-950/20' : 'bg-white/90 dark:bg-n-8/90'}`}>
              <div>
                {activeItem.isHighPriority && <p className="text-xs font-bold text-red-600 tracking-wider mb-1">HIGH PRIORITY</p>}
                <h2 className="text-slate-900 dark:text-n-1 font-semibold text-sm">Detection ID: {activeItem.id}</h2>
                <p className="text-xs text-slate-500 dark:text-n-4 mt-1">Detected at {activeItem.time}</p>
              </div>
              <button onClick={() => setSelectedDetection("")} className="text-slate-400 hover:text-slate-600 dark:text-n-3 dark:hover:text-n-1"><X className="w-5 h-5" /></button>
            </div>

          <div className="p-6 flex-1 flex flex-col gap-6">
             
             {/* Forensic Comparison */}
             <div>
               <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-n-1 text-sm tracking-wide mb-4">
                 <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-color-1" /> Forensic Comparison
               </h3>
               
               <div className="grid grid-cols-2 gap-3">
                 <div className="flex flex-col gap-2">
                   <div className="bg-black aspect-video rounded border border-slate-200 dark:border-n-1/10 relative overflow-hidden flex items-center justify-center group">
                      <div className="absolute top-1 left-1 bg-black/60 px-1.5 py-0.5 text-[8px] font-bold tracking-widest text-[#79FFF7] uppercase rounded z-10">Master Asset</div>
                      {activeItem.image ? <Image src={activeItem.image} alt="Master" layout="fill" objectFit="cover" className="opacity-80" /> : <div className="w-12 h-12 rounded-full shadow-[0_0_15px_rgba(121,255,247,0.5)] border border-[#79FFF7]/50"></div>}
                   </div>
                   <p className="text-[10px] text-slate-500 dark:text-n-3 leading-tight truncate">Source: Internal_Vault</p>
                 </div>
                 <div className="flex flex-col gap-2">
                   <div className={`bg-black aspect-video rounded border-2 relative overflow-hidden flex items-center justify-center ${activeItem.isHighPriority ? 'border-red-600/50' : 'border-slate-500/50'}`}>
                      <div className={`absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded z-10 ${activeItem.isHighPriority ? 'bg-rose-900/80 text-rose-200' : 'bg-slate-800/80 text-slate-200'}`}>Suspected Copy</div>
                      {activeItem.image && <Image src={activeItem.image} alt="Suspect" layout="fill" objectFit="cover" className="opacity-80 mix-blend-overlay grayscale" />}
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white/70 border-b-[8px] border-b-transparent opacity-80 z-20"></div>
                   </div>
                   <p className="text-[10px] text-red-600 dark:text-rose-400 leading-tight">Platform: {activeItem.platform}</p>
                 </div>
               </div>
             </div>

             {/* Scores */}
             <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl border border-slate-200 dark:border-n-1/10 bg-slate-50 dark:bg-n-7 flex flex-col justify-center">
                 <p className="text-[10px] font-bold text-slate-500 dark:text-n-3 tracking-widest uppercase mb-2">Fingerprint Score</p>
                 <p className="text-3xl font-bold font-grotesk text-slate-900 dark:text-n-1">{activeItem.confidence.replace('%', '')}<span className="text-lg text-slate-400 dark:text-n-4 ml-1">%</span></p>
                 <div className="w-full bg-slate-200 dark:bg-n-6 h-1 mt-3 rounded-full overflow-hidden">
                   <div className="bg-red-600 dark:bg-color-3 h-full animate-in slide-in-from-left duration-1000" style={{ width: activeItem.confidence }}></div>
                 </div>
               </div>
               
               <div className="p-4 rounded-xl border border-slate-200 dark:border-n-1/10 bg-slate-50 dark:bg-n-7 flex flex-col justify-center">
                 <p className="text-[10px] font-bold text-slate-500 dark:text-n-3 tracking-widest uppercase mb-2">Confidence</p>
                 <div className={`flex items-center gap-1.5 font-semibold mb-1 ${activeItem.confColor}`}>
                   <BadgeCheck className="w-4 h-4" /> {activeItem.status}
                 </div>
                 <p className="text-[10px] text-slate-400 dark:text-n-4 mt-2">{activeItem.reason}</p>
               </div>
             </div>

             {/* Metadata */}
             <div>
               <h3 className="font-bold text-slate-900 dark:text-n-1 text-sm tracking-wide uppercase mb-4 border-b border-slate-200 dark:border-n-1/10 pb-2">Technical Metadata</h3>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between items-center"><span className="text-slate-500 dark:text-n-3">Uploader</span><span className="font-medium text-slate-900 dark:text-n-1">ClipMaster99 (ID: UC282...)</span></div>
                 <div className="flex justify-between items-center"><span className="text-slate-500 dark:text-n-3">Content ID</span><span className="font-medium text-slate-900 dark:text-n-1">554A-FF</span></div>
                 <div className="flex justify-between items-center"><span className="text-slate-500 dark:text-n-3">View Count</span><span className="font-medium text-slate-900 dark:text-n-1">12,482 (Rising)</span></div>
                 <div className="flex justify-between items-center"><span className="text-slate-500 dark:text-n-3">Resolution</span><span className="font-medium text-slate-900 dark:text-n-1">1080p @ 60fps</span></div>
               </div>
             </div>

             {/* Analyst Recommendation */}
             <div className="bg-blue-50 border border-blue-200 text-blue-900 dark:bg-color-1/10 dark:border-color-1/20 dark:text-n-1 rounded-xl p-4 mt-auto">
               <h4 className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide mb-2 text-blue-700 dark:text-color-1">
                 <Sparkles className="w-4 h-4" /> Analyst Recommendation
               </h4>
               <p className="text-xs leading-relaxed text-blue-800/80 dark:text-n-2/80">
                 The detected clip includes the exclusive &apos;Season Finale&apos; signature. Visual markers indicate this is a direct screen capture from our premium stream. Automated take-down is highly recommended to prevent viral spread.
               </p>
             </div>

          </div>

           {/* Action buttons footer */}
           <div className="p-4 border-t border-slate-200 dark:border-n-1/10 grid grid-cols-3 gap-2 bg-slate-50 dark:bg-n-8/50">
              <button disabled={!!isProcessing} onClick={() => handleAction("Marked Safe")} className="flex flex-col items-center justify-center py-2 px-1 border border-slate-200 dark:border-n-1/10 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-n-3 dark:hover:bg-n-7 transition-all active:scale-95 disabled:opacity-50">
                {isProcessing === "Marked Safe" ? <Loader2 className="w-5 h-5 mb-1 text-emerald-500 animate-spin" /> : <BadgeCheck className="w-5 h-5 mb-1 text-emerald-500" />}
                <span className="text-[10px] font-bold tracking-widest uppercase">Safe</span>
              </button>
              <button disabled={!!isProcessing} onClick={() => handleAction("Sent for Review")} className="flex flex-col items-center justify-center py-2 px-1 border border-slate-200 dark:border-n-1/10 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-n-3 dark:hover:bg-n-7 transition-all active:scale-95 disabled:opacity-50">
                {isProcessing === "Sent for Review" ? <Loader2 className="w-5 h-5 mb-1 text-amber-500 animate-spin" /> : <FileWarning className="w-5 h-5 mb-1 text-amber-500" />}
                <span className="text-[10px] font-bold tracking-widest uppercase">Review</span>
              </button>
              <button disabled={!!isProcessing} onClick={() => handleAction("Take-down Initiated")} className="flex flex-col items-center justify-center py-2 px-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg transition-all active:scale-95 shadow-sm disabled:opacity-50">
                {isProcessing === "Take-down Initiated" ? <Loader2 className="w-5 h-5 mb-1 animate-spin" /> : <ShieldAlert className="w-5 h-5 mb-1" />}
                <span className="text-[10px] font-bold tracking-widest uppercase">Violation</span>
              </button>
           </div>
        </div>
        );
      })()}

    </div>
  );
}

// Custom icon for the loader rotation
function RefreshIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
