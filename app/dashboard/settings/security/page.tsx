"use client";

import React, { useState } from "react";
import { Download, RefreshCw, Shield, Activity, Fingerprint, Network, ChevronDown, X, CheckCircle2, Loader2, AlertTriangle, Lock, Eye } from "lucide-react";

const allEvents = [
  { id: 1, type: "API Key Rotation", sub: "Infrastructure Update", user: "marcus.chen@media.intel", avatar: "MC", ip: "192.168.1.104", time: "Apr 21, 2026 · 14:22:01", severity: "MEDIUM", sevColor: "bg-blue-600 dark:bg-color-1", textColor: "text-slate-700 dark:text-n-2" },
  { id: 2, type: "Permission Change", sub: "IAM Access Policy", user: "sarah.j@media.intel", avatar: "SJ", ip: "172.16.254.1", time: "Apr 21, 2026 · 13:45:18", severity: "HIGH RISK", sevColor: "bg-red-600 dark:bg-color-3", textColor: "text-red-700 dark:text-color-3" },
  { id: 3, type: "User Login", sub: "Web UI Session", user: "d.vance@media.intel", avatar: "DV", ip: "82.145.21.12", time: "Apr 21, 2026 · 12:10:44", severity: "INFO", sevColor: "bg-slate-400 dark:bg-n-4", textColor: "text-slate-500 dark:text-n-4" },
  { id: 4, type: "System Config Update", sub: "Global Firewall Rule", user: "Auto-Scale Bot", avatar: "AB", ip: "INTERNAL_GATEWAY", time: "Apr 20, 2026 · 23:59:59", severity: "MEDIUM", sevColor: "bg-blue-600 dark:bg-color-1", textColor: "text-slate-700 dark:text-n-2" },
  { id: 5, type: "API Key Rotation", sub: "Compliance Auto-Gen", user: "elena.v@media.intel", avatar: "EV", ip: "203.0.113.42", time: "Apr 20, 2026 · 10:30:12", severity: "INFO", sevColor: "bg-slate-400 dark:bg-n-4", textColor: "text-slate-500 dark:text-n-4" },
  { id: 6, type: "Brute Force Attempt", sub: "Multiple Login Failures", user: "UNKNOWN (blocked)", avatar: "??", ip: "91.234.104.21", time: "Apr 19, 2026 · 03:14:07", severity: "HIGH RISK", sevColor: "bg-red-600 dark:bg-color-3", textColor: "text-red-700 dark:text-color-3" },
  { id: 7, type: "User Login", sub: "API Token Auth", user: "j.wu@mediarights.ai", avatar: "JW", ip: "10.0.0.22", time: "Apr 19, 2026 · 09:02:44", severity: "INFO", sevColor: "bg-slate-400 dark:bg-n-4", textColor: "text-slate-500 dark:text-n-4" },
];

const SEVERITIES = ["All Severities", "HIGH RISK", "MEDIUM", "INFO"];
const TIMERANGES = ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "All Time"];
const ITEMS_PER_PAGE = 5;

export default function SecuritySettings() {
  const [severityFilter, setSeverityFilter] = useState("All Severities");
  const [timeFilter, setTimeFilter] = useState("Last 24 Hours");
  const [showSevDD, setShowSevDD] = useState(false);
  const [showTimeDD, setShowTimeDD] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [twoFaModal, setTwoFaModal] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);
  const [eventDetailId, setEventDetailId] = useState<number | null>(null);
  const [detailsMode, setDetailsMode] = useState<"full" | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warn" } | null>(null);
  const [biometricEnforced, setBiometricEnforced] = useState(true);
  const [zeroTrust, setZeroTrust] = useState(true);
  const [logAssistant, setLogAssistant] = useState(false);

  const showToast = (msg: string, type: "success" | "warn" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredEvents = allEvents.filter(e => severityFilter === "All Severities" || e.severity === severityFilter);
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const pageEvents = filteredEvents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); showToast("Security stream refreshed!"); }, 1500);
  };

  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); showToast("Audit log exported as audit_log_apr2026.csv"); }, 1800);
  };

  const detailEvent = allEvents.find(e => e.id === eventDetailId);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 relative" onClick={() => { setShowSevDD(false); setShowTimeDD(false); }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 ${toast.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-amber-500 border-amber-400 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      {/* 2FA Modal */}
      {twoFaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setTwoFaModal(false)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-color-1/10 rounded-xl flex items-center justify-center border border-blue-100 dark:border-color-1/20"><Shield className="w-5 h-5 text-blue-600 dark:text-color-1" /></div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">2FA Policy Manager</h3>
              </div>
              <button onClick={() => setTwoFaModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 mb-6">
              {[["Enforce 2FA for all Admin accounts", true], ["Require TOTP (not SMS) for Tier 1 access", true], ["Auto-lockout after 5 failed 2FA attempts", false]].map(([label, def]) => (
                <label key={label as string} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-n-7 rounded-xl border border-slate-200 dark:border-n-6 cursor-pointer">
                  <span className="text-sm font-medium text-slate-700 dark:text-n-2">{label as string}</span>
                  <div className="relative">
                    <input type="checkbox" defaultChecked={def as boolean} className="sr-only peer" />
                    <div className="w-9 h-5 rounded-full bg-slate-200 dark:bg-n-6 peer-checked:bg-blue-600 dark:peer-checked:bg-color-1 transition-colors"></div>
                    <div className="w-4 h-4 bg-white rounded-full absolute top-[2px] left-[2px] peer-checked:translate-x-4 transition-transform shadow-sm"></div>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={() => { setTwoFaModal(false); showToast("2FA policy enforced for all admin users!"); }} className="w-full py-3 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white rounded-lg text-sm font-bold transition-colors">Apply Policy</button>
          </div>
        </div>
      )}

      {/* Session Modal */}
      {sessionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSessionModal(false)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">Active Sessions</h3>
              <button onClick={() => setSessionModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-6">
              {[["Chrome · macOS", "San Francisco, USA", "Current session", true], ["Safari · iPhone", "New York, USA", "2h ago", false], ["Firefox · Windows", "London, UK", "Yesterday", false]].map(([device, loc, time, isCurrent]) => (
                <div key={device as string} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-n-7 rounded-xl border border-slate-200 dark:border-n-6">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-n-1">{device as string}</p>
                    <p className="text-[10px] text-slate-500 dark:text-n-4">{loc as string} · {time as string}</p>
                  </div>
                  {isCurrent ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/20 rounded border border-emerald-200 dark:border-emerald-800">Active</span>
                  ) : (
                    <button onClick={() => { setSessionModal(false); showToast("Session revoked!", "warn"); }} className="text-[10px] font-bold text-red-500 hover:underline">Revoke</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => { setSessionModal(false); showToast("All other sessions terminated!", "warn"); }} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors">Terminate All Other Sessions</button>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {detailEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEventDetailId(null)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">{detailEvent.type}</h3>
                <p className="text-sm text-slate-500 dark:text-n-3">{detailEvent.sub}</p>
              </div>
              <button onClick={() => setEventDetailId(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-6">
              {[["User", detailEvent.user], ["Source IP", detailEvent.ip], ["Timestamp", detailEvent.time], ["Severity", detailEvent.severity]].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-n-7 rounded-lg border border-slate-100 dark:border-n-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-n-4">{k}</span>
                  <span className={`text-xs font-bold ${k === "Severity" ? detailEvent.textColor : "text-slate-900 dark:text-n-1"}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setEventDetailId(null); showToast("Event escalated to security team!", "warn"); }} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors">Escalate Event</button>
              <button onClick={() => { setEventDetailId(null); showToast("Event marked as reviewed."); }} className="flex-1 py-2.5 bg-slate-100 dark:bg-n-7 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold">Mark Reviewed</button>
            </div>
          </div>
        </div>
      )}

      {/* Action Row */}
      <div className="flex justify-end gap-3">
        <button onClick={handleExportCSV} disabled={exporting} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-n-8 border border-slate-200 dark:border-n-1/10 text-slate-700 dark:text-n-1 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-n-7 transition-colors disabled:opacity-60">
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
        <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white dark:text-n-8 text-sm font-bold rounded-lg shadow-sm transition-colors border border-blue-700 dark:border-color-1/50 disabled:opacity-60">
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh Stream"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* 2FA Card */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-600 dark:border-l-color-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-color-1/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-color-1 shadow-sm border border-blue-100 dark:border-color-1/20"><Shield className="w-5 h-5" /></div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-n-4">Security Core</span>
          </div>
          <div>
            <p className="text-slate-600 dark:text-n-3 font-semibold text-sm mb-1">2FA Enforcement</p>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-grotesk font-bold tracking-tight text-slate-900 dark:text-n-1">98.4%</span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-color-1 mb-1">+1.2% vs last month</span>
            </div>
            <button onClick={() => setTwoFaModal(true)} className="text-[11px] font-bold text-blue-600 dark:text-color-1 hover:underline">Review Non-Compliant Users →</button>
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-slate-50 dark:bg-n-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-n-3 border border-slate-200 dark:border-n-1/10"><Activity className="w-5 h-5" /></div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-n-4">Live Traffic</span>
          </div>
          <div>
            <p className="text-slate-600 dark:text-n-3 font-semibold text-sm mb-1">Active Sessions</p>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-grotesk font-bold tracking-tight text-slate-900 dark:text-n-1">42</span>
              <div className="flex items-end gap-1 mb-1.5 h-6">
                {[4, 6, 3, 5, 8].map((h, i) => <div key={i} className="w-1.5 bg-slate-200 dark:bg-n-7 rounded-sm" style={{ height: `${h * 10}%` }}></div>)}
                <div className="w-1.5 bg-slate-400 dark:bg-n-4 rounded-sm" style={{ height: "100%" }}></div>
              </div>
            </div>
            <button onClick={() => setSessionModal(true)} className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-n-4 dark:hover:text-n-1 hover:underline">Manage Session Tokens →</button>
          </div>
        </div>

        {/* Suspicious Attempts */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm border-l-4 border-l-red-500 dark:border-l-color-3 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-red-50 dark:bg-color-3/10 rounded-lg flex items-center justify-center text-red-600 dark:text-color-3 shadow-sm border border-red-100 dark:border-color-3/20"><Shield className="w-5 h-5" /></div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-n-4">Risk Assessment</span>
          </div>
          <div>
            <p className="text-slate-600 dark:text-n-3 font-semibold text-sm mb-1">Suspicious Attempts</p>
            <div className="mb-6"><span className="text-3xl font-grotesk font-bold tracking-tight text-slate-900 dark:text-n-1 mr-2">3</span><span className="text-[11px] font-semibold text-red-600 dark:text-color-3">Isolated in last 24h</span></div>
            <div className="w-full h-px bg-slate-100 dark:bg-n-1/10 mb-4"></div>
            <button onClick={() => { setEventDetailId(6); }} className="text-[11px] font-bold text-red-600 dark:text-color-3 hover:underline flex items-center">Open Threat Incident Map →</button>
          </div>
        </div>

        {/* Security Snapshot */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-n-4 mb-4">Security Snapshot</span>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0b0a12] border border-slate-100 dark:border-n-8 rounded-lg shadow-sm">
              <div className="flex items-center gap-2.5"><Fingerprint className="w-4 h-4 text-blue-600 dark:text-color-1" /><span className="text-xs font-bold text-slate-800 dark:text-n-1">Biometric Auth Active</span></div>
              <button onClick={() => { setBiometricEnforced(v => !v); showToast(biometricEnforced ? "Biometric auth disabled!" : "Biometric auth enforced!", biometricEnforced ? "warn" : "success"); }} className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded border transition-colors ${biometricEnforced ? "bg-blue-100/50 dark:bg-color-1/10 text-blue-700 dark:text-color-1 border-blue-200 dark:border-color-1/20" : "bg-slate-100 dark:bg-n-7 text-slate-500 border-slate-200 dark:border-n-6"}`}>{biometricEnforced ? "Enforced" : "Disabled"}</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0b0a12] border border-slate-100 dark:border-n-8 rounded-lg shadow-sm">
              <div className="flex items-center gap-2.5"><Network className="w-4 h-4 text-blue-600 dark:text-color-1" /><span className="text-xs font-bold text-slate-800 dark:text-n-1">Zero-Trust Tunneling</span></div>
              <button onClick={() => { setZeroTrust(v => !v); showToast(zeroTrust ? "Zero-trust tunnel closed!" : "Zero-trust tunnel established!", zeroTrust ? "warn" : "success"); }} className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded border transition-colors ${zeroTrust ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" : "bg-slate-100 dark:bg-n-7 text-slate-500 border-slate-200 dark:border-n-6"}`}>{zeroTrust ? "Connected" : "Offline"}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Ledger Table */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl shadow-sm overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b border-slate-200 dark:border-n-1/10 gap-4">
          <h3 className="text-[11px] font-bold text-slate-900 dark:text-n-1 uppercase tracking-widest flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue-600 dark:bg-color-1"></span> System Event Ledger
          </h3>
          <div className="flex gap-3 relative">
            {[{ label: severityFilter, options: SEVERITIES, show: showSevDD, setShow: setShowSevDD, setValue: (v: string) => { setSeverityFilter(v); setPage(1); } }, { label: timeFilter, options: TIMERANGES, show: showTimeDD, setShow: setShowTimeDD, setValue: setTimeFilter }].map(({ label, options, show, setShow, setValue }) => (
              <div key={label} className="relative">
                <button onClick={e => { e.stopPropagation(); setShow(!show); setShowSevDD(false); setShowTimeDD(false); }} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-n-3 bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 transition-colors">
                  {label} <ChevronDown className="w-3 h-3" />
                </button>
                {show && (
                  <div className="absolute right-0 top-9 bg-white dark:bg-n-7 border border-slate-200 dark:border-n-1/10 rounded-xl shadow-xl z-30 w-44 py-1 animate-in fade-in zoom-in-95 duration-150">
                    {options.map(opt => (
                      <button key={opt} onClick={() => { setValue(opt); setShow(false); }} className={`w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-n-6 transition-colors ${opt === label ? "font-bold text-blue-600 dark:text-color-1" : "text-slate-700 dark:text-n-2"}`}>{opt}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-n-8 border-b border-slate-200 dark:border-n-1/10">
              <tr>
                {["Event Type", "User / Identity", "Source IP", "Timestamp", "Severity", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-n-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-n-1/10 text-sm">
              {pageEvents.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-n-8/30 cursor-pointer transition-colors" onClick={() => setEventDetailId(e.id)}>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 dark:text-n-1 text-[13px]">{e.type}</div>
                    <div className="text-[10px] text-slate-500 dark:text-n-4 mt-0.5">{e.sub}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-n-6 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-n-3 border border-white dark:border-n-8 shadow-sm">{e.avatar}</div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-n-2">{e.user}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-slate-500 dark:text-n-4">{e.ip}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-xs text-slate-600 dark:text-n-4 leading-tight">
                      <span>{e.time.split("·")[0].trim()}</span>
                      <span>{e.time.split("·")[1]?.trim()}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase ${e.textColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${e.sevColor}`}></span> {e.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={ev => { ev.stopPropagation(); setEventDetailId(e.id); }} className="text-slate-400 hover:text-slate-900 dark:hover:text-n-1 transition-colors"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-n-1/10 flex items-center justify-between bg-white dark:bg-[#0E0C15]">
          <span className="text-xs text-slate-500 dark:text-n-4">Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filteredEvents.length)}–{Math.min(page * ITEMS_PER_PAGE, filteredEvents.length)} of {filteredEvents.length} entries</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-n-7 disabled:opacity-40 text-sm">{"<"}</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors ${page === p ? "bg-blue-600 dark:bg-color-1 text-white dark:text-n-8 shadow-sm" : "text-slate-600 dark:text-n-3 hover:bg-slate-100 dark:hover:bg-n-7"}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-n-7 disabled:opacity-40 text-sm">{">"}</button>
          </div>
        </div>
      </div>

      {/* Log Assistant CTA */}
      <div className="mt-4 p-8 rounded-2xl bg-gradient-to-br from-[#0B1528] to-[#0E0C15] dark:border dark:border-n-1/10 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex-1">
          <h3 className="text-lg font-bold text-white mb-2">Need Audit Assistance?</h3>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">Our AI analyst can help identify patterns in system logs and generate compliance reports automatically.</p>
        </div>
        {logAssistant ? (
          <div className="relative z-10 flex items-center gap-3 px-6 py-2.5 bg-emerald-500 rounded-lg text-white text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" /> Assistant Launched!
          </div>
        ) : (
          <button onClick={() => { setLogAssistant(true); showToast("Log Assistant is analyzing your audit stream..."); }} className="relative z-10 px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-900 border border-transparent rounded-lg text-sm font-bold shadow-sm whitespace-nowrap transition-colors">Launch Log Assistant</button>
        )}
      </div>
    </div>
  );
}
