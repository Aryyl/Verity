"use client";

import React, { useState } from "react";
import { Moon, Globe2, Mail, Plus, CheckCircle2, Loader2, AlertTriangle, X } from "lucide-react";

type MatrixState = { inApp: boolean; email: boolean; slack: boolean; push: boolean };

const initialMatrix: Record<string, MatrixState> = {
  "Critical Violations": { inApp: true, email: true, slack: true, push: true },
  "Major Violations": { inApp: true, email: true, slack: false, push: false },
  "Minor Violations": { inApp: true, email: false, slack: false, push: false },
};

const TIMEZONES = [
  "(GMT-08:00) Pacific Time (US & Canada)",
  "(GMT-05:00) Eastern Time (US & Canada)",
  "(GMT+00:00) UTC / London",
  "(GMT+05:30) India Standard Time",
  "(GMT+08:00) Singapore / Hong Kong",
  "(GMT+09:00) Tokyo / Seoul",
];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function NotificationSettings() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [quietEnabled, setQuietEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");
  const [activeDays, setActiveDays] = useState([true, true, true, true, true, false, false]);
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [autoArchive, setAutoArchive] = useState(false);
  const [weeklyPdf, setWeeklyPdf] = useState(true);
  const [teamsModal, setTeamsModal] = useState(false);
  const [teamsUrl, setTeamsUrl] = useState("");
  const [teamsSaved, setTeamsSaved] = useState(false);
  const [slackConnected, setSlackConnected] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "loading" | "done">("idle");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warn" } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const showToast = (msg: string, type: "success" | "warn" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleMatrix = (tier: string, channel: keyof MatrixState) => {
    setMatrix(prev => ({ ...prev, [tier]: { ...prev[tier], [channel]: !prev[tier][channel] } }));
    setHasChanges(true);
  };

  const toggleDay = (i: number) => {
    setActiveDays(prev => prev.map((d, idx) => idx === i ? !d : d));
    setHasChanges(true);
  };

  const handleSaveTeams = () => {
    if (!teamsUrl.trim()) return;
    setTeamsSaved(true);
    setTeamsModal(false);
    showToast("Microsoft Teams webhook connected!");
    setHasChanges(true);
  };

  const handleSave = () => {
    setSaveState("loading");
    setTimeout(() => {
      setSaveState("done");
      setHasChanges(false);
      showToast("Notification preferences saved!");
      setTimeout(() => setSaveState("idle"), 3000);
    }, 1500);
  };

  const dotColors: Record<string, string> = {
    "Critical Violations": "bg-red-600 dark:bg-color-3",
    "Major Violations": "bg-amber-500 dark:bg-amber-400",
    "Minor Violations": "bg-blue-600 dark:bg-color-1",
  };

  const descs: Record<string, string> = {
    "Critical Violations": "Immediate action required",
    "Major Violations": "24-hour response window",
    "Minor Violations": "Informational/low impact",
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 ${toast.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-amber-500 border-amber-400 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      {/* Teams Modal */}
      {teamsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setTeamsModal(false)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">Connect Microsoft Teams</h3>
              <button onClick={() => setTeamsModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-500 dark:text-n-3 mb-6">Paste your Microsoft Teams Incoming Webhook URL to receive violation alerts directly in your channel.</p>
            <label className="block text-xs font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-2">Webhook URL</label>
            <input value={teamsUrl} onChange={e => setTeamsUrl(e.target.value)} placeholder="https://outlook.office.com/webhook/..." className="w-full px-4 py-3 bg-slate-50 dark:bg-n-7 border border-slate-200 dark:border-n-6 rounded-xl text-sm text-slate-900 dark:text-n-1 focus:outline-none focus:ring-2 ring-blue-500 mb-6" />
            <div className="flex gap-3">
              <button onClick={handleSaveTeams} disabled={!teamsUrl.trim()} className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-colors">Connect</button>
              <button onClick={() => setTeamsModal(false)} className="flex-1 py-3 bg-slate-100 dark:bg-n-7 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Violation Routing Matrix */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-n-1">Violation Routing Matrix</h2>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 dark:bg-color-1/10 dark:text-color-1 text-[9px] uppercase font-bold tracking-widest rounded shadow-sm border border-blue-200 dark:border-color-1/20">Live Config</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
            <thead className="text-slate-500 dark:text-n-4 font-bold tracking-normal text-[11px] border-b border-slate-200 dark:border-n-1/10">
              <tr>
                <th className="pb-4">Violation Severity</th>
                <th className="pb-4 text-center">In-App Dashboard</th>
                <th className="pb-4 text-center">Email Digest</th>
                <th className="pb-4 text-center">Slack Integration</th>
                <th className="pb-4 text-center">Push Notifications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-n-1/10">
              {Object.entries(matrix).map(([tier, state]) => (
                <tr key={tier} className="hover:bg-slate-50 dark:hover:bg-n-8/30">
                  <td className="py-4 font-bold text-slate-900 dark:text-n-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${dotColors[tier]}`}></div> {tier}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-n-4 font-normal ml-4">{descs[tier]}</div>
                  </td>
                  {(["inApp", "email", "slack", "push"] as const).map(ch => (
                    <td key={ch} className="py-4 text-center">
                      <button onClick={() => toggleMatrix(tier, ch)} className={`w-5 h-5 rounded border flex items-center justify-center mx-auto transition-all active:scale-90 ${state[ch] ? "bg-blue-600 border-blue-600 dark:bg-color-1 dark:border-color-1" : "bg-transparent border-slate-300 dark:border-n-6 hover:border-blue-400"}`}>
                        {state[ch] && <svg className="w-3 h-3 text-white dark:text-n-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiet Hours */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-n-1">Quiet Hours</h3>
              </div>
              <button onClick={() => { setQuietEnabled(q => !q); setHasChanges(true); }} className={`w-9 h-5 rounded-full relative transition-colors ${quietEnabled ? "bg-blue-600 dark:bg-color-1" : "bg-slate-200 dark:bg-n-6"}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-[2px] transition-all shadow-sm ${quietEnabled ? "left-[18px]" : "left-[2px]"}`}></div>
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-n-4 mb-6">Suppress non-critical alerts during rest periods</p>
          </div>
          <div className={`flex gap-4 mb-6 transition-opacity ${quietEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-2">Starts At</label>
              <input type="time" value={quietStart} onChange={e => { setQuietStart(e.target.value); setHasChanges(true); }} className="w-full px-3 py-2 bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-md text-sm text-slate-700 dark:text-n-1 font-medium focus:outline-none focus:ring-2 ring-blue-500" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-2">Ends At</label>
              <input type="time" value={quietEnd} onChange={e => { setQuietEnd(e.target.value); setHasChanges(true); }} className="w-full px-3 py-2 bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-md text-sm text-slate-700 dark:text-n-1 font-medium focus:outline-none focus:ring-2 ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-2">Active Days</label>
            <div className="flex gap-2">
              {DAYS.map((day, i) => (
                <button key={i} onClick={() => toggleDay(i)} className={`w-8 h-8 rounded text-xs font-bold transition-colors ${activeDays[i] ? "bg-blue-600 dark:bg-color-1 text-white dark:text-n-8" : "bg-slate-100 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 text-slate-400 dark:text-n-4 hover:bg-slate-200 dark:hover:bg-n-7"}`}>{day}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Sync */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <Globe2 className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-slate-900 dark:text-n-1">Global Sync</h3>
          </div>
          <div className="mt-4 flex flex-col gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-2">Account Timezone</label>
              <select value={timezone} onChange={e => { setTimezone(e.target.value); setHasChanges(true); }} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-md text-sm text-slate-700 dark:text-n-2 font-medium appearance-none outline-none focus:border-blue-500">
                {TIMEZONES.map(tz => <option key={tz}>{tz}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              {[["autoArchive", "Auto-archive old alerts", autoArchive, () => { setAutoArchive(v => !v); setHasChanges(true); }], ["weeklyPdf", "Weekly performance PDF", weeklyPdf, () => { setWeeklyPdf(v => !v); setHasChanges(true); }]].map(([key, label, val, handler]) => (
                <label key={key as string} onClick={handler as any} className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50 dark:bg-[#0b0a12] dark:hover:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-lg cursor-pointer transition-colors shadow-sm">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${val ? "bg-blue-600 border-blue-600 dark:bg-color-1 dark:border-color-1" : "bg-transparent border-slate-300 dark:border-n-6"}`}>
                    {val && <svg className="w-3 h-3 text-white dark:text-n-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-n-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" /> {label as string}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Channel Integrations */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-n-1">Channel Integrations</h2>
          <button onClick={() => setTeamsModal(true)} className="text-[10px] font-bold text-blue-600 dark:text-color-1 uppercase tracking-widest hover:underline">Add New Connection</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-200 dark:border-n-1/10 rounded-xl p-4 flex gap-4 items-center bg-slate-50 dark:bg-n-8/30 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-n-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-n-1/10 shadow-sm flex-shrink-0">
                <span className="font-bold text-[#E01E5A] text-xs">Slack</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-bold text-slate-900 dark:text-n-1 text-sm truncate">Slack Workspace</span>
                <span className={`text-[10px] font-semibold truncate ${slackConnected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-n-4"}`}>{slackConnected ? "Connected: #alerts-rights" : "Disconnected"}</span>
              </div>
            </div>
            <button onClick={() => { setSlackConnected(c => !c); setHasChanges(true); showToast(slackConnected ? "Slack disconnected" : "Slack reconnected!", slackConnected ? "warn" : "success"); }} className={`text-[10px] font-bold px-2.5 py-1 rounded border transition-colors flex-shrink-0 ${slackConnected ? "border-red-200 text-red-500 hover:bg-red-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}`}>
              {slackConnected ? "Disconnect" : "Connect"}
            </button>
          </div>
          <div className="border border-slate-200 dark:border-n-1/10 rounded-xl p-4 flex gap-4 items-center bg-slate-50 dark:bg-n-8/30">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center border border-blue-700 shadow-sm flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-bold text-slate-900 dark:text-n-1 text-sm truncate">Direct Email</span>
              <span className="text-[10px] text-slate-500 dark:text-n-4 font-medium truncate">Active: Primary Admin</span>
            </div>
          </div>
          <button onClick={() => setTeamsModal(true)} className={`border rounded-xl p-4 flex gap-4 items-center hover:bg-slate-50 dark:hover:bg-n-8/50 transition-colors group ${teamsSaved ? "border-emerald-300 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20" : "border-dashed border-slate-300 dark:border-n-6"}`}>
            <div className="w-10 h-10 bg-slate-100 dark:bg-n-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-n-1/10 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
              {teamsSaved ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Plus className="w-5 h-5" />}
            </div>
            <div className="flex flex-col text-left">
              <span className={`font-bold text-sm group-hover:text-blue-600 transition-colors ${teamsSaved ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-n-3"}`}>Microsoft Teams</span>
              <span className="text-[10px] text-slate-400 dark:text-n-4">{teamsSaved ? "Connected" : "Click to configure"}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 mt-2 py-4 border-t border-slate-100 dark:border-n-1/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-n-4">
          {hasChanges && <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Unsaved changes</>}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { setHasChanges(false); showToast("Changes discarded", "warn"); }} className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-n-3 hover:text-slate-900 dark:hover:text-n-1 transition-colors">Discard</button>
          <button onClick={handleSave} disabled={saveState !== "idle"} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors ${saveState === "done" ? "bg-emerald-600 text-white" : "bg-blue-700 hover:bg-blue-800 dark:bg-color-1 dark:hover:opacity-90 text-white dark:text-n-8"}`}>
            {saveState === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : saveState === "done" ? <CheckCircle2 className="w-4 h-4" /> : null}
            {saveState === "idle" ? "Save Settings" : saveState === "loading" ? "Saving..." : "Saved!"}
          </button>
        </div>
      </div>
    </div>
  );
}
