"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight, CheckCircle2, Loader2, AlertTriangle, RotateCcw } from "lucide-react";

type Strictness = "Low" | "Medium" | "High";

export default function SensitivitySettings() {
  const [visualPct, setVisualPct] = useState(88);
  const [audioPct, setAudioPct] = useState(64);
  const [deepfakeLevel, setDeepfakeLevel] = useState<Strictness>("High");
  const [neuralBackcheck, setNeuralBackcheck] = useState(true);
  const [shadowProfiling, setShadowProfiling] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simResult, setSimResult] = useState<"pass" | "fail" | null>("pass");
  const [saveState, setSaveState] = useState<"idle" | "loading" | "done">("idle");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warn" } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [changelog, setChangelog] = useState(false);

  const defaultValues = { visual: 88, audio: 64, deepfake: "High" as Strictness, neural: true, shadow: false };

  const showToast = (msg: string, type: "success" | "warn" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const runSimulator = () => {
    setSimRunning(true);
    setSimResult(null);
    setTimeout(() => {
      const score = (visualPct * 0.6 + audioPct * 0.4) / 100;
      setSimResult(score > 0.7 ? "pass" : "fail");
      setSimRunning(false);
      showToast(score > 0.7 ? "Simulation passed — thresholds are optimal!" : "Simulation flagged — consider adjusting thresholds.", score > 0.7 ? "success" : "warn");
    }, 2200);
  };

  const handleReset = () => {
    setVisualPct(defaultValues.visual);
    setAudioPct(defaultValues.audio);
    setDeepfakeLevel(defaultValues.deepfake);
    setNeuralBackcheck(defaultValues.neural);
    setShadowProfiling(defaultValues.shadow);
    setHasChanges(false);
    showToast("Settings reset to defaults", "warn");
  };

  const handleSave = () => {
    setSaveState("loading");
    setTimeout(() => {
      setSaveState("done");
      setHasChanges(false);
      showToast("Detection thresholds deployed!");
      setTimeout(() => setSaveState("idle"), 3000);
    }, 1800);
  };

  const matchScore = Math.round(visualPct * 0.6 + audioPct * 0.4);
  const matchColor = matchScore > 80 ? "bg-emerald-500" : matchScore > 55 ? "bg-amber-400" : "bg-red-500";
  const matchLabel = matchScore > 80 ? "text-emerald-600 dark:text-emerald-400" : matchScore > 55 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-color-3";

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 ${toast.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-amber-500 border-amber-400 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Column */}
        <div className="flex-[2] flex flex-col gap-6">

          {/* Detection Thresholds */}
          <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm border-t-4 border-t-blue-600 dark:border-t-color-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-n-1 mb-8">Detection Thresholds</h2>
            <div className="flex flex-col gap-10">

              {/* Visual */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-n-1">Visual Fingerprint Match Threshold</h3>
                    <p className="text-[11px] text-slate-500 dark:text-n-4 mt-0.5">Minimum confidence score for image/video frame similarity matching.</p>
                  </div>
                  <span className="text-xl font-bold text-blue-700 dark:text-color-1 tracking-tight">{visualPct}<span className="text-[10px] text-slate-400 font-sans">%</span></span>
                </div>
                <div className="w-full relative py-3">
                  <div className="w-full h-1 bg-slate-200 dark:bg-n-7 rounded-full"></div>
                  <div className="absolute top-3 left-0 h-1 bg-blue-600 dark:bg-color-1 rounded-full transition-all duration-150" style={{ width: `${visualPct}%` }}></div>
                  <input type="range" min={0} max={100} value={visualPct} onChange={e => { setVisualPct(+e.target.value); setHasChanges(true); setSimResult(null); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="absolute top-2 w-4 h-4 bg-white border-2 border-blue-600 dark:border-color-1 rounded-full shadow-md pointer-events-none transition-all duration-150" style={{ left: `calc(${visualPct}% - 8px)` }}></div>
                </div>
                <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-n-4 mt-1">
                  <span>Permissive</span><span>Standard</span><span>Absolute</span>
                </div>
              </div>

              {/* Audio */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-n-1">Audio Hash Overlap</h3>
                    <p className="text-[11px] text-slate-500 dark:text-n-4 mt-0.5">Required temporal overlap for audio sample identification.</p>
                  </div>
                  <span className="text-xl font-bold text-blue-700 dark:text-color-1 tracking-tight">{audioPct}<span className="text-[10px] text-slate-400 font-sans">ms</span></span>
                </div>
                <div className="w-full relative py-3">
                  <div className="w-full h-1 bg-slate-200 dark:bg-n-7 rounded-full"></div>
                  <div className="absolute top-3 left-0 h-1 bg-blue-600 dark:bg-color-1 rounded-full transition-all duration-150" style={{ width: `${(audioPct / 500) * 100}%` }}></div>
                  <input type="range" min={0} max={500} value={audioPct} onChange={e => { setAudioPct(+e.target.value); setHasChanges(true); setSimResult(null); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="absolute top-2 w-4 h-4 bg-white border-2 border-blue-600 dark:border-color-1 rounded-full shadow-md pointer-events-none transition-all duration-150" style={{ left: `calc(${(audioPct / 500) * 100}% - 8px)` }}></div>
                </div>
                <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-n-4 mt-1">
                  <span>Granular</span><span>Optimal</span><span>Coarse</span>
                </div>
              </div>

              {/* Deepfake */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-n-1">Deepfake Analysis Strictness</h3>
                    <p className="text-[11px] text-slate-500 dark:text-n-4 mt-0.5">Aggressiveness of the neural network in flagging facial inconsistency.</p>
                  </div>
                  <span className={`text-lg font-bold tracking-tight ${deepfakeLevel === "High" ? "text-red-600 dark:text-color-3" : deepfakeLevel === "Medium" ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}>{deepfakeLevel}</span>
                </div>
                <div className="flex p-1 bg-slate-100 dark:bg-n-8 rounded-lg overflow-hidden border border-slate-200 dark:border-n-1/10">
                  {(["Low", "Medium", "High"] as Strictness[]).map(level => (
                    <button key={level} onClick={() => { setDeepfakeLevel(level); setHasChanges(true); }} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${deepfakeLevel === level ? "bg-white dark:bg-n-6 text-blue-700 dark:text-color-1 shadow-sm border border-slate-200 dark:border-n-5" : "text-slate-500 dark:text-n-4 hover:text-slate-700 dark:hover:text-n-2"}`}>{level}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 border-l-4 border-l-blue-600 dark:border-l-color-1 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-n-1">Neural Back-check</h3>
                <p className="text-xs text-slate-500 dark:text-n-4 mt-2 leading-relaxed">Enable secondary validation pass for all matches above 95% threshold to ensure 0% false positive rate on critical alerts.</p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button onClick={() => { setNeuralBackcheck(v => !v); setHasChanges(true); }} className={`w-9 h-5 rounded-full relative transition-colors ${neuralBackcheck ? "bg-blue-600 dark:bg-color-1" : "bg-slate-200 dark:bg-n-6"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-[2px] transition-all shadow-sm ${neuralBackcheck ? "left-[18px]" : "left-[2px]"}`}></div>
                </button>
                <span className={`text-sm font-bold ${neuralBackcheck ? "text-slate-900 dark:text-n-1" : "text-slate-400 dark:text-n-4"}`}>{neuralBackcheck ? "Active" : "Inactive"}</span>
              </div>
            </div>
            <div className={`border border-l-4 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-colors ${shadowProfiling ? "bg-white dark:bg-[#0E0C15] border-slate-200 dark:border-n-1/10 border-l-blue-600 dark:border-l-color-1" : "bg-slate-50 dark:bg-n-8/30 border-slate-200 dark:border-n-1/10 border-l-slate-300 dark:border-l-n-6"}`}>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-n-1">Shadow Profiling</h3>
                <p className="text-xs text-slate-500 dark:text-n-4 mt-2 leading-relaxed">Run background sensitivity tests on archived data to predict threshold effectiveness on future streams.</p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button onClick={() => { setShadowProfiling(v => !v); setHasChanges(true); }} className={`w-9 h-5 rounded-full relative transition-colors ${shadowProfiling ? "bg-blue-600 dark:bg-color-1" : "bg-slate-200 dark:bg-n-6"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-[2px] transition-all shadow-sm ${shadowProfiling ? "left-[18px]" : "left-[2px]"}`}></div>
                </button>
                <span className={`text-sm font-bold ${shadowProfiling ? "text-slate-900 dark:text-n-1" : "text-slate-500 dark:text-n-4"}`}>{shadowProfiling ? "Active" : "Disabled"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Test Sensitivity */}
          <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-900 dark:text-n-1 flex items-center gap-2 mb-6">
              <span className="w-3 h-3 rounded bg-blue-600 dark:bg-color-1"></span> Test Sensitivity
            </h3>
            <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-n-4 mb-2">Sample Data Hash</p>
            <div className="bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-lg p-3 text-xs font-mono text-slate-600 dark:text-n-3 break-all leading-relaxed mb-6">
              SHA256: 4a8e2b1c9d3f...7e6b5e4d3c2b1
            </div>

            <div className="flex justify-between items-end mb-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-n-2">Projected Match Score</span>
              <span className={`text-sm font-bold tracking-tight ${matchLabel}`}>{matchScore}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-n-7 rounded-full mb-6 overflow-hidden">
              <div className={`h-full ${matchColor} rounded-full transition-all duration-500`} style={{ width: `${matchScore}%` }}></div>
            </div>

            <button onClick={runSimulator} disabled={simRunning} className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-color-1 text-white dark:text-n-8 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2 border border-blue-600 dark:border-color-1/50 disabled:opacity-70">
              {simRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {simRunning ? "Running Simulation..." : "Run Simulator"}
            </button>

            {simResult && (
              <div className={`mt-6 pt-6 border-t border-slate-100 dark:border-n-1/10 animate-in fade-in duration-300`}>
                <p className={`flex items-center gap-2 text-xs font-bold mb-1 ${simResult === "pass" ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-color-3"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${simResult === "pass" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                  {simResult === "pass" ? "PASS: Threshold Met" : "WARN: Threshold Too Low"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-n-4 leading-relaxed">
                  {simResult === "pass" ? "Current settings would trigger a high-level alert for this sample." : "Consider raising Visual or Audio thresholds to improve detection accuracy."}
                </p>
              </div>
            )}
          </div>

          {/* Active Policy */}
          <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-900 dark:text-n-1 mb-4">Active Global Policy</p>
            <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-color-1/5 border border-blue-100 dark:border-color-1/10 rounded-xl mb-4">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-color-1" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-n-1 text-sm">Tier 1 Response</h4>
                <p className="text-[9px] text-slate-500 dark:text-n-4 mt-0.5 uppercase tracking-wider">Last updated: Apr 21, 2026 · 08:14</p>
              </div>
            </div>
            <button onClick={() => { setChangelog(c => !c); showToast(changelog ? "Changelog collapsed" : "Changelog loaded!"); }} className="text-[11px] font-bold text-blue-600 dark:text-color-1 flex items-center gap-1.5 hover:underline uppercase tracking-wider">
              {changelog ? "Hide Changelog" : "View Changelog"} <ArrowRight className="w-3 h-3" />
            </button>
            {changelog && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-n-8 rounded-xl border border-slate-200 dark:border-n-1/10 text-[11px] text-slate-600 dark:text-n-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                {[["Apr 21 08:14", "Deepfake strictness → High"], ["Apr 20 16:21", "Visual threshold 80% → 88%"], ["Apr 18 09:11", "Shadow Profiling disabled"], ["Apr 15 11:45", "Audio hash 55ms → 64ms"]].map(([t, c]) => (
                  <div key={t} className="flex justify-between"><span className="font-mono text-slate-400">{t}</span><span>{c}</span></div>
                ))}
              </div>
            )}
          </div>

          {/* Neural Node */}
          <div className="rounded-2xl shadow-sm border border-slate-800 dark:border-n-1/10 overflow-hidden relative bg-slate-900 h-28 flex flex-col justify-end p-4">
            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(90deg,transparent_1px,#1e293b_1px)] bg-[size:10px_100%]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
            <div className="relative z-10 flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-1">Neural Node Status</span>
              <span className="text-white text-sm font-bold flex items-center gap-2">
                Core-04 Active <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Stable
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4 border-t border-slate-100 dark:border-n-1/10">
        <span className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-n-3">
          {hasChanges && <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Unsaved Changes detected</>}
        </span>
        <div className="flex items-center gap-4">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-500 dark:text-n-4 hover:text-slate-900 dark:hover:text-n-1 transition-colors"><RotateCcw className="w-4 h-4" /> Reset to Defaults</button>
          <button onClick={() => { setHasChanges(false); showToast("Changes discarded", "warn"); }} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-n-3 hover:text-slate-900 dark:hover:text-n-1 transition-colors">Discard</button>
          <button onClick={handleSave} disabled={saveState !== "idle"} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors ${saveState === "done" ? "bg-emerald-600 text-white" : "bg-blue-700 hover:bg-blue-800 dark:bg-color-1 dark:hover:opacity-90 text-white dark:text-n-8"}`}>
            {saveState === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : saveState === "done" ? <CheckCircle2 className="w-4 h-4" /> : null}
            {saveState === "idle" ? "Deploy Configuration" : saveState === "loading" ? "Deploying..." : "Deployed!"}
          </button>
        </div>
      </div>
    </div>
  );
}
