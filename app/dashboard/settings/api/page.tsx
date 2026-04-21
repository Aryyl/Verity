"use client";

import React, { useState } from "react";
import { Copy, BookOpen, History, Shield, Key, Sliders, UserMinus, CheckCircle2, Loader2, AlertTriangle, X, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

const initialKey = "sk_prod_9921_x9f2_8028_mr_n_88";

const initialAuditLogs = [
  { id: 1, icon: "key", title: "API Key Regenerated", desc: "Action by: Alex Chen (Admin)", time: "Apr 21, 2026 · 14:22:01", color: "text-blue-600 dark:text-color-1" },
  { id: 2, icon: "slider", title: "System Sensitivity Updated", desc: "Visual threshold changed from 80% to 85%", time: "Apr 20, 2026 · 16:21:04", color: "text-blue-600 dark:text-color-1" },
  { id: 3, icon: "user", title: "Member Access Revoked", desc: "User: d.smith@partner.ai", time: "Apr 18, 2026 · 09:11:33", color: "text-red-600 dark:text-color-3" },
];

type RouteRow = { tier: string; dot: string; email: boolean; slack: boolean; inApp: boolean };

const initialRoutes: RouteRow[] = [
  { tier: "Critical (Tier 1)", dot: "bg-red-600 dark:bg-color-3", email: true, slack: true, inApp: true },
  { tier: "Major (Tier 2)", dot: "bg-blue-600 dark:bg-color-1", email: true, slack: false, inApp: true },
  { tier: "Minor (Tier 3)", dot: "bg-slate-400 dark:bg-n-4", email: false, slack: false, inApp: true },
];

const initialWebhooks = [
  { id: 1, url: "https://hooks.slack.com/T01234/B56789/xxxx", event: "violation.created", active: true },
  { id: 2, url: "https://api.company.com/webhooks/dmca", event: "dmca.escalated", active: true },
  { id: 3, url: "https://notify.internal.io/alerts", event: "system.alert", active: false },
  { id: 4, url: "https://data.mediarights.ai/ingest", event: "scan.completed", active: true },
];

export default function ApiManagementSettings() {
  const [apiKey, setApiKey] = useState(initialKey);
  const [showKey, setShowKey] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [keyRegenerating, setKeyRegenerating] = useState(false);
  const [routes, setRoutes] = useState<RouteRow[]>(initialRoutes);
  const [auditLogs] = useState(initialAuditLogs);
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [showNewWebhook, setShowNewWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvent, setNewWebhookEvent] = useState("violation.created");
  const [saveState, setSaveState] = useState<"idle" | "loading" | "done">("idle");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warn" } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [twoFaModal, setTwoFaModal] = useState(false);

  const showToast = (msg: string, type: "success" | "warn" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey).catch(() => {});
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
    showToast("API key copied to clipboard");
  };

  const handleRegenerate = () => {
    setKeyRegenerating(true);
    setTimeout(() => {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      const rand = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      setApiKey(`sk_prod_${rand(4)}_${rand(4)}_${rand(4)}_mr_n_${rand(2)}`);
      setKeyRegenerating(false);
      showToast("API key regenerated! Update your integrations.");
    }, 1500);
  };

  const toggleRoute = (idx: number, field: "email" | "slack" | "inApp") => {
    setRoutes(prev => prev.map((r, i) => i === idx ? { ...r, [field]: !r[field] } : r));
    setHasChanges(true);
  };

  const toggleWebhook = (id: number) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
    setHasChanges(true);
    showToast("Webhook status updated");
  };

  const deleteWebhook = (id: number) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    setHasChanges(true);
    showToast("Webhook deleted", "warn");
  };

  const addWebhook = () => {
    if (!newWebhookUrl.trim()) return;
    setWebhooks(prev => [...prev, { id: Date.now(), url: newWebhookUrl, event: newWebhookEvent, active: true }]);
    setNewWebhookUrl(""); setNewWebhookEvent("violation.created");
    setShowNewWebhook(false);
    setHasChanges(true);
    showToast("Webhook endpoint added!");
  };

  const handleSave = () => {
    setSaveState("loading");
    setTimeout(() => {
      setSaveState("done");
      setHasChanges(false);
      showToast("API settings saved successfully!");
      setTimeout(() => setSaveState("idle"), 3000);
    }, 1500);
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

      {/* 2FA Modal stub */}
      {twoFaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setTwoFaModal(false)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-blue-50 dark:bg-color-1/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-color-1/20">
              <Shield className="w-7 h-7 text-blue-600 dark:text-color-1" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-n-1 mb-2">2FA is Enforced</h3>
            <p className="text-sm text-slate-500 dark:text-n-3 mb-6">All admin accounts require TOTP-based two-factor authentication. Currently enforced for 98.4% of users.</p>
            <button onClick={() => { setTwoFaModal(false); showToast("2FA management panel opened!"); }} className="w-full py-3 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white rounded-lg text-sm font-bold transition-colors">Manage 2FA Policy</button>
          </div>
        </div>
      )}

      {/* API Key Section */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-n-1">API Management</h2>
            <p className="text-sm text-slate-500 dark:text-n-3 mt-1">Manage authentication keys and monitor usage limits.</p>
          </div>
          <button onClick={() => showToast("Documentation opened!")} className="flex items-center gap-1.5 text-blue-600 dark:text-color-1 text-xs font-bold hover:underline">
            <BookOpen className="w-4 h-4" /> Documentation
          </button>
        </div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-4 mb-2">Production API Key</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 bg-slate-100 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-lg p-3 flex justify-between items-center text-sm font-mono text-slate-600 dark:text-n-3 overflow-hidden">
            <span className="truncate">{showKey ? apiKey : "•".repeat(apiKey.length)}</span>
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              <button onClick={() => setShowKey(s => !s)} className="text-slate-400 hover:text-slate-600 dark:hover:text-n-2 transition-colors">{showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              <button onClick={handleCopyKey} className={`transition-colors ${keyCopied ? "text-emerald-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-n-2"}`}>{keyCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
            </div>
          </div>
          <button onClick={handleRegenerate} disabled={keyRegenerating} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-n-7 hover:bg-slate-300 dark:hover:bg-n-6 text-slate-800 dark:text-n-1 rounded-lg text-sm font-bold shadow-sm transition-colors border border-transparent dark:border-n-1/10 disabled:opacity-60">
            {keyRegenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {keyRegenerating ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-n-1/10 rounded-xl p-4 bg-slate-50 dark:bg-n-8/30">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-4 mb-3">Rate Limit Status</p>
            <div className="flex items-end justify-between mb-2">
              <p className="font-grotesk font-bold text-3xl tracking-tight text-slate-900 dark:text-n-1">1.2M <span className="text-sm text-slate-400 tracking-normal font-sans">/ 5M</span></p>
              <span className="text-xs font-bold text-blue-600 dark:text-color-1 mb-1">24% Used</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-n-7 rounded-sm overflow-hidden">
              <div className="h-full bg-blue-600 dark:bg-color-1 rounded-sm transition-all duration-1000" style={{ width: "24%" }}></div>
            </div>
          </div>
          <div className="border border-slate-200 dark:border-n-1/10 rounded-xl p-4 bg-slate-50 dark:bg-n-8/30 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-4 mb-2">Active Webhooks</p>
                <p className="font-grotesk font-bold text-3xl tracking-tight text-slate-900 dark:text-n-1">{webhooks.filter(w => w.active).length.toString().padStart(2, "0")}</p>
              </div>
              <button onClick={() => setShowNewWebhook(true)} className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-color-1/10 dark:text-color-1 border border-blue-200 dark:border-color-1/20 text-xs font-bold rounded shadow-sm hover:bg-blue-100 dark:hover:bg-color-1/20 transition-colors flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Webhook
              </button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-n-4 mt-4 truncate">Global: https://api.mediarights.ai/v1/events</p>
          </div>
        </div>
      </div>

      {/* Webhooks List */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-n-1">Webhook Endpoints</h2>
          {showNewWebhook && (
            <button onClick={() => setShowNewWebhook(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-4 h-4" /></button>
          )}
        </div>
        {showNewWebhook && (
          <div className="mb-6 p-4 bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-xl flex flex-col sm:flex-row gap-3 animate-in slide-in-from-top-2 duration-200">
            <input value={newWebhookUrl} onChange={e => setNewWebhookUrl(e.target.value)} placeholder="https://your-endpoint.com/hook" className="flex-1 px-4 py-2.5 bg-white dark:bg-n-7 border border-slate-200 dark:border-n-6 rounded-lg text-sm focus:outline-none focus:ring-2 ring-blue-500 text-slate-900 dark:text-n-1" />
            <select value={newWebhookEvent} onChange={e => setNewWebhookEvent(e.target.value)} className="px-3 py-2.5 bg-white dark:bg-n-7 border border-slate-200 dark:border-n-6 rounded-lg text-sm text-slate-700 dark:text-n-2 focus:outline-none">
              {["violation.created", "dmca.escalated", "scan.completed", "system.alert"].map(e => <option key={e}>{e}</option>)}
            </select>
            <button onClick={addWebhook} disabled={!newWebhookUrl.trim()} className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-colors">Add</button>
          </div>
        )}
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-n-1/10">
          {webhooks.map((wh) => (
            <div key={wh.id} className="flex items-center justify-between py-4 group">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${wh.active ? "bg-emerald-500" : "bg-slate-300 dark:bg-n-6"}`}></div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-slate-700 dark:text-n-2 truncate max-w-xs">{wh.url}</p>
                  <p className="text-[10px] text-slate-400 dark:text-n-4 mt-0.5 font-bold tracking-wider">{wh.event}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <button onClick={() => toggleWebhook(wh.id)} className={`w-9 h-5 rounded-full relative transition-colors ${wh.active ? "bg-blue-600 dark:bg-color-1" : "bg-slate-200 dark:bg-n-6"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-[2px] transition-all shadow-sm ${wh.active ? "left-[18px]" : "left-[2px]"}`}></div>
                </button>
                <button onClick={() => deleteWebhook(wh.id)} className="p-1.5 text-slate-300 dark:text-n-6 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Routing */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-n-1">Notification Routing</h2>
        <p className="text-sm text-slate-500 dark:text-n-3 mt-1 mb-6">Configure alerts for different violation severities and channels.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[500px]">
            <thead className="text-slate-500 dark:text-n-4 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200 dark:border-n-1/10">
              <tr>
                <th className="pb-4">Severity Tier</th>
                <th className="pb-4 text-center">Email</th>
                <th className="pb-4 text-center">Slack</th>
                <th className="pb-4 text-center">In-App</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-n-1/10">
              {routes.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-n-8/30">
                  <td className="py-4 flex items-center gap-2 font-bold text-slate-900 dark:text-n-1">
                    <div className={`w-2 h-2 rounded-full ${r.dot}`}></div> {r.tier}
                  </td>
                  {(["email", "slack", "inApp"] as const).map(field => (
                    <td key={field} className="py-4 text-center">
                      <button onClick={() => { toggleRoute(idx, field); setHasChanges(true); }} className={`w-5 h-5 rounded border flex items-center justify-center mx-auto transition-all active:scale-90 ${r[field] ? "bg-blue-600 border-blue-600 dark:bg-color-1 dark:border-color-1" : "bg-transparent border-slate-300 dark:border-n-6 hover:border-blue-400"}`}>
                        {r[field] && <svg className="w-3 h-3 text-white dark:text-n-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Audit Logs */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-n-1 mb-1">Security & Audit Logs</h2>
            <p className="text-sm text-slate-500 dark:text-n-3">Monitor administrative activity and account security status.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showToast("Login history panel loaded!")} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded text-xs font-bold text-slate-600 dark:text-n-3 hover:bg-slate-200 transition-colors">
              <History className="w-3.5 h-3.5" /> Login History
            </button>
            <button onClick={() => setTwoFaModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 dark:bg-color-1 text-white dark:text-n-8 rounded text-xs font-bold shadow hover:bg-blue-700 transition-colors">
              <Shield className="w-3.5 h-3.5" /> 2FA Settings
            </button>
          </div>
        </div>
        <div className="bg-slate-100/50 dark:bg-n-8/30 rounded-t-lg p-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-4 border-b border-slate-200 dark:border-n-1/10">Recent Administrative Actions</div>
        <div className="divide-y divide-slate-100 dark:divide-n-1/10">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex justify-between items-center py-4 hover:bg-slate-50 dark:hover:bg-n-8/20 -mx-2 px-2 rounded transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-0.5">
                  {log.icon === "key" && <Key className={`w-4 h-4 ${log.color}`} />}
                  {log.icon === "slider" && <Sliders className={`w-4 h-4 ${log.color}`} />}
                  {log.icon === "user" && <UserMinus className={`w-4 h-4 ${log.color}`} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-n-1">{log.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-n-4 mt-0.5">{log.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-n-4 ml-4 whitespace-nowrap">{log.time}</span>
            </div>
          ))}
        </div>
        <button onClick={() => showToast("Full audit log fetched!")} className="w-full text-center py-3 mt-2 text-xs font-bold text-blue-600 dark:text-color-1 uppercase tracking-widest hover:underline border-t border-slate-100 dark:border-n-1/10">View All Audit Logs</button>
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
