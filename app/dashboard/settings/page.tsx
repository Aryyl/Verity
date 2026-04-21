"use client";

import React, { useState } from "react";
import { Plus, MoreVertical, Copy, AlertTriangle, CheckCircle2, Loader2, X, Trash2, Shield, ChevronDown } from "lucide-react";

const ROLES = ["Admin", "Analyst", "Viewer", "Compliance"];

const initialMembers = [
  { id: 1, initials: "SM", name: "Sarah Miller", email: "s.miller@mediarights.ai", role: "Admin", status: "Active", bg: "bg-blue-100 text-blue-700 dark:bg-color-1/20 dark:text-color-1" },
  { id: 2, initials: "JW", name: "James Wu", email: "j.wu@mediarights.ai", role: "Analyst", status: "Active", bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { id: 3, initials: "AK", name: "Aisha Khan", email: "a.khan@mediarights.ai", role: "Compliance", status: "Invited", bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
];

export default function UserManagementSettings() {
  const [members, setMembers] = useState(initialMembers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Analyst");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "loading" | "done">("idle");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warn" } | null>(null);
  const [apiKey, setApiKey] = useState("sk_prod_9921_x9f2_0028_mr_m_88");
  const [keyCopied, setKeyCopied] = useState(false);
  const [keyRegenerating, setKeyRegenerating] = useState(false);
  const [notifications, setNotifications] = useState({ highPriority: true, weeklySummary: true, systemHealth: false });
  const [sensitivity, setSensitivity] = useState({ visual: 85, audio: 62 });
  const [hasChanges, setHasChanges] = useState(false);

  const showToast = (msg: string, type: "success" | "warn" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddMember = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const colors = ["bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"];
    const initials = newName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setMembers(prev => [...prev, { id: Date.now(), initials, name: newName, email: newEmail, role: newRole, status: "Invited", bg: colors[Math.floor(Math.random() * colors.length)] }]);
    setNewName(""); setNewEmail(""); setNewRole("Analyst");
    setShowAddModal(false);
    setHasChanges(true);
    showToast(`Invitation sent to ${newEmail}`);
  };

  const handleRemoveMember = (id: number) => {
    const m = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    setOpenMenuId(null);
    setHasChanges(true);
    showToast(`${m?.name} removed from team`, "warn");
  };

  const handleRoleChange = (id: number, role: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    setEditingRole(null);
    setHasChanges(true);
    showToast(`Role updated to ${role}`);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey).catch(() => {});
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
    showToast("API key copied to clipboard");
  };

  const handleRegenerateKey = () => {
    setKeyRegenerating(true);
    setTimeout(() => {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      const rand = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      setApiKey(`sk_prod_${rand(4)}_${rand(4)}_${rand(4)}_mr_m_${rand(2)}`);
      setKeyRegenerating(false);
      showToast("API key regenerated successfully");
    }, 1500);
  };

  const handleSave = () => {
    setSaveState("loading");
    setTimeout(() => {
      setSaveState("done");
      setHasChanges(false);
      showToast("All settings saved successfully!");
      setTimeout(() => setSaveState("idle"), 3000);
    }, 1500);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
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

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">Invite Team Member</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {[["Full Name", newName, setNewName, "text", "e.g. Jane Smith"], ["Work Email", newEmail, setNewEmail, "email", "e.g. jane@company.ai"]].map(([label, val, setter, type, ph]) => (
                <div key={label as string}>
                  <label className="block text-xs font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-2">{label as string}</label>
                  <input value={val as string} onChange={e => (setter as any)(e.target.value)} type={type as string} placeholder={ph as string} className="w-full px-4 py-3 bg-slate-50 dark:bg-n-7 border border-slate-200 dark:border-n-6 rounded-xl text-sm text-slate-900 dark:text-n-1 focus:outline-none focus:ring-2 ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-2">Role</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-n-7 border border-slate-200 dark:border-n-6 rounded-xl text-sm text-slate-900 dark:text-n-1 focus:outline-none focus:ring-2 ring-blue-500">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddMember} disabled={!newName.trim() || !newEmail.trim()} className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-colors">Send Invite</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-slate-100 dark:bg-n-7 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-n-1">Active Team Members</h2>
            <p className="text-sm text-slate-500 dark:text-n-3 mt-1">Manage roles and workspace permissions for your analysts.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 dark:hover:opacity-90 text-white dark:text-n-8 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-100 dark:bg-n-8 text-slate-500 dark:text-n-4 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200 dark:border-n-1/10">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Member</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 rounded-tr-lg"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-n-1/10">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-n-8/30 transition-colors relative">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm border-2 border-white dark:border-n-8 shadow-sm ${member.bg}`}>{member.initials}</div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-n-1">{member.name}</div>
                      <div className="text-xs text-slate-500 dark:text-n-4">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {editingRole === member.id ? (
                    <select autoFocus value={member.role} onChange={e => handleRoleChange(member.id, e.target.value)} onBlur={() => setEditingRole(null)} className="px-2 py-1 bg-white dark:bg-n-7 border border-blue-400 rounded text-xs font-bold text-slate-700 dark:text-n-1 focus:outline-none">
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  ) : (
                    <button onClick={() => setEditingRole(member.id)} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-n-7 text-slate-600 dark:text-n-3 text-[11px] font-bold tracking-wider rounded border border-slate-200 dark:border-n-6 hover:border-blue-400 hover:text-blue-600 dark:hover:text-color-1 transition-colors group">
                      {member.role} <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                    </button>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-n-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${member.status === "Active" ? "bg-blue-600 dark:bg-color-1" : "bg-amber-500 animate-pulse"}`}></span>
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right relative">
                  <button onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-n-7 rounded text-slate-400 dark:text-n-4 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openMenuId === member.id && (
                    <div className="absolute right-6 top-12 bg-white dark:bg-n-7 border border-slate-200 dark:border-n-1/10 rounded-xl shadow-xl z-20 w-40 py-1 animate-in fade-in zoom-in-95 duration-150">
                      <button onClick={() => { setEditingRole(member.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-n-6 text-slate-700 dark:text-n-2 font-medium">Change Role</button>
                      <button onClick={() => handleRemoveMember(member.id)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Preferences */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-n-1 mb-1">Notification Preferences</h3>
          <p className="text-xs text-slate-500 dark:text-n-4 mb-6">Configure how you receive critical alerts.</p>
          <div className="flex flex-col gap-5">
            {([["highPriority", "High-Priority Violations", "Instant alert for Tier 1 assets"], ["weeklySummary", "Weekly Summary Reports", "Aggregate detection statistics"], ["systemHealth", "System Health Alerts", "Downtime or latency warnings"]] as const).map(([key, title, desc]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-n-1">{title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-n-4 mt-0.5">{desc}</p>
                </div>
                <button onClick={() => toggleNotification(key)} className={`w-11 h-6 rounded-full relative transition-colors ${notifications[key] ? "bg-blue-600 dark:bg-color-1" : "bg-slate-200 dark:bg-n-6"}`}>
                  <div className={`shadow-sm w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notifications[key] ? "left-[22px]" : "left-0.5"}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Detection Sensitivity */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 dark:text-n-1 mb-1">Detection Sensitivity</h3>
          <p className="text-xs text-slate-500 dark:text-n-4 mb-6">Adjust AI thresholds for match precision.</p>
          <div className="flex flex-col gap-6 flex-1">
            {([["visual", "VISUAL FINGERPRINT MATCH", "%"] as const, ["audio", "AUDIO HASH OVERLAP", "%"] as const]).map(([key, label, unit]) => (
              <div key={key}>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-n-2 tracking-widest uppercase">{label}</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-color-1">{sensitivity[key]}{unit}</span>
                </div>
                <input type="range" min={0} max={100} value={sensitivity[key]}
                  onChange={e => { setSensitivity(prev => ({ ...prev, [key]: +e.target.value })); setHasChanges(true); }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-n-7 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[9px] text-slate-400 dark:text-n-4 font-medium uppercase tracking-widest mt-1.5">
                  <span>Lenient</span><span>Strict</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-slate-50 dark:bg-n-8/50 border border-slate-100 dark:border-n-8 rounded-lg p-3 text-[10px] text-slate-500 dark:text-n-4 leading-relaxed">
            <span className="font-bold text-slate-700 dark:text-n-2">Note:</span> Increasing strictness reduces false positives but may lead to missed partial matches in highly edited content.
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-n-1 mb-1">API Integration Keys</h3>
        <p className="text-xs text-slate-500 dark:text-n-4 mb-6">Securely connect external reporting tools and crawlers.</p>
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-4 mb-2">Production Key</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-slate-100 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-lg p-3 flex justify-between items-center text-sm font-mono text-slate-600 dark:text-n-3 overflow-hidden">
            <span className="truncate">{apiKey}</span>
            <button onClick={handleCopyKey} className={`ml-3 flex-shrink-0 transition-colors ${keyCopied ? "text-emerald-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-n-2"}`}>
              {keyCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={handleRegenerateKey} disabled={keyRegenerating} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-n-7 hover:bg-slate-300 dark:hover:bg-n-6 text-slate-800 dark:text-n-1 rounded-lg text-sm font-bold shadow-sm transition-colors border border-transparent dark:border-n-1/10 disabled:opacity-60">
            {keyRegenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {keyRegenerating ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
        <p className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-red-600 dark:text-color-3">
          <AlertTriangle className="w-3.5 h-3.5" /> Keys are sensitive data. Do not share publicly.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 mt-2 py-4 border-t border-slate-100 dark:border-n-1/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-n-4">
          {hasChanges && <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Unsaved changes</>}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { setHasChanges(false); showToast("Changes discarded", "warn"); }}  className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-n-3 hover:text-slate-900 dark:hover:text-n-1 transition-colors">Discard</button>
          <button onClick={handleSave} disabled={saveState !== "idle"} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors ${saveState === "done" ? "bg-emerald-600 text-white" : "bg-blue-700 hover:bg-blue-800 dark:bg-color-1 dark:hover:opacity-90 text-white dark:text-n-8"}`}>
            {saveState === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : saveState === "done" ? <CheckCircle2 className="w-4 h-4" /> : null}
            {saveState === "idle" ? "Save Settings" : saveState === "loading" ? "Saving..." : "Saved!"}
          </button>
        </div>
      </div>
    </div>
  );
}
